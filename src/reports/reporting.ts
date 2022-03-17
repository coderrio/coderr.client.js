import {
    IContextCollectionProviderContext,
    IContextCollection,
    ILogEntry,
} from '../context-collections/interfaces';
import { uniqueid } from '../utilities';
import {
    IErrorReportDTO,
    IContextCollectionDTO,
    IErrorDTO,
    IDictionaryDTO,
} from '../contracts/dto';
import { getCoderrCollection, toCollection } from '../context-collections';
import { IReporter } from './interfaces';
import { IConfiguration } from '../config/configuration';
import { IReportUploader } from '../uploaders/interfaces';
import { CoderrError } from '../error';
import { IReportFilterContext } from './report-filter';
import { ErrorReportDTO } from '../contracts/dto-implementations';
import { PartitionContext } from '../config/partitions';

/**
 * Context used per default if the error is not caught in a specific environment (like DOM or any of the popular frontend frameworks).
 */
export class VanillaContext implements IContextCollectionProviderContext {
    public contextType = 'Vanilla';
    public contextCollections: IContextCollection[] = [];

    constructor(public source: any, public error: Error) {}
    logEntries: ILogEntry[] = [];
}

/**
 * Default implementation of IReporter.
 *
 * Uses XHR if no other reporter have been specified.
 */
export class Reporter implements IReporter {
    constructor(private configuration: IConfiguration, private uploader: IReportUploader) {
        if (!this.configuration){
            throw new Error("Configuration was not specified.");
        }
        if (!uploader) {
            throw new Error('Uploader must be specified');
        }


        if (this.configuration.environmentName === '') {
            this.configuration.environmentName = 'Development';
        }

        this.uploader = uploader;
    }

    public report(error: Error, contextData?: any): void {
        const ctx: IContextCollectionProviderContext = new VanillaContext(this, error);
        if (contextData) {
            this.convertContextData(contextData, ctx.contextCollections);
        }

        this.reportByContext(ctx);
    }

    public reportByContext(context: IContextCollectionProviderContext): void {
        this.configuration.contextProviders.forEach((provider) => {
            provider.collect(context);
        });

        if (context.error instanceof CoderrError) {
            const coderrError = <CoderrError>context.error;
            this.processCoderrError(coderrError, context.contextCollections);
        }

        const coderrCollection = getCoderrCollection(context.contextCollections);
        if (this.configuration.applicationVersion !== '') {
            coderrCollection.properties['AppAssemblyVersion'] = this.configuration.applicationVersion;
        }

        if (this.configuration.errorPreProcessor){
            this.configuration.errorPreProcessor(context);
        }
        
        var partitionContext =new PartitionContext(coderrCollection, context);
        this.configuration.partitionProviders.forEach(x=>x(partitionContext));

        const report: IErrorReportDTO = {
            ReportId: uniqueid(),
            CreatedAtUtc: new Date().toISOString(),
            EnvironmentName: this.configuration.environmentName,
            Exception: this.convertErrorToDto(context.error),
            ContextCollections: this.convertCollections(context.contextCollections),
        };

        if (this.isFilteredOut(report)){
            return;
        }

        this.upload(report);
    }

    private upload(report: IErrorReportDTO): void {
        this.uploader.upload(report);
    }

    private isFilteredOut(report: ErrorReportDTO): boolean{
        var context: IReportFilterContext={
            canSubmitReport: true,
            report: report
        };
        this.configuration.filters.forEach(x=>x.invoke(context));
        return !context.canSubmitReport;

    }
    private processCoderrError(error: CoderrError, collections: IContextCollection[]): void {
        if (error.contextData) {
            this.convertContextData(error.contextData, collections);
        }

        const coderrCollection = getCoderrCollection(collections);
        for (const key in error.partitions) {
            const value = error.partitions[key];
            coderrCollection.properties[`ErrPartition.${key}`] = value;
        }

        for (const key in error.facts) {
            const value = error.facts[key];
            coderrCollection.properties[`QuickFact.${key}`] = value;
        }

        if (error.showCollectionNamed) {
            coderrCollection.properties['HighlightCollections'] = error.showCollectionNamed;
        }

        if (error.tags) {
            let tags = coderrCollection.properties['ErrTags'];
            if (tags) {
                tags += ',' + error.tags.join(',');
            } else {
                coderrCollection.properties['ErrTags'] = error.tags.join(',');
            }
        }

        if (error.correlationId) {
            coderrCollection.properties['CorrelationId'] = error.correlationId;
        }
    }

    private convertContextData(contextData: any, collections: IContextCollection[]): void {
        if (Array.isArray(contextData)) {
            contextData.forEach((x, index) => {
                if (!x.name || !x.properties) {
                    if (index === 0) {
                        x = toCollection('ContextData', x);
                    } else {
                        x = toCollection('ContextData' + (index + 1), x);
                    }
                    collections.push(x);

                } else{
                    collections.push(this.flattenCollection(x));
                }
            });
        } else {
            let collection: IContextCollection;
            if (!contextData.name || !contextData.properties) {
                collection = toCollection('ContextData', contextData);
            } else {
                collection = this.flattenCollection(contextData);
            }

            collections.push(collection);
        }
    }

    /** Used to guard against manual collections that are not flat */
    private flattenCollection(contextCollection: any): IContextCollection{
        for (var name in contextCollection.properties) {
            if (contextCollection.properties.hasOwnProperty(name)) {
                contextCollection.properties[name] = contextCollection.properties[name].toString();
            }
        }
        return contextCollection;
    }

    private convertCollections(collections: IContextCollection[]): IContextCollectionDTO[] {
        const dtos: IContextCollectionDTO[] = [];
        collections.forEach((item) => {
            const dict: IDictionaryDTO = {};
            for (const key in item.properties) {
                if (Object.prototype.hasOwnProperty.call(item.properties, key)) {
                    const value = item.properties[key];
                    dict[key] = value as any as string;
                }
            }

            const dto: IContextCollectionDTO = {
                Name: item.name,
                Properties: dict,
            };
            dtos.push(dto);
        });
        return dtos;
    }

    private convertErrorToDto(error: Error): IErrorDTO {
        let stackTrace = error.stack;
        if (!stackTrace) {
            stackTrace = '';
        }

        const dto: IErrorDTO = {
            FullName: error.name,
            Message: error.message,
            StackTrace: stackTrace,
            AssemblyName: '',
            Properties: {},
        };

        const dyn = error as any;

        // Microsoft
        if (dyn.description && dyn.description !== error.message) {
            dto.Properties['description'] = dyn.description;
        }
        if (Object.prototype.hasOwnProperty.call(dyn, 'number')) {
            dto.Properties['number'] = dyn.number;
        }

        // Mozilla
        if (Object.prototype.hasOwnProperty.call(dyn, 'fileName')) {
            dto.Properties['fileName'] = dyn.fileName;
        }
        if (Object.prototype.hasOwnProperty.call(dyn, 'lineNumber')) {
            dto.Properties['lineNumber'] = dyn.lineNumber;
        }
        if (Object.prototype.hasOwnProperty.call(dyn, 'columnNumber')) {
            dto.Properties['columnNumber'] = dyn.columnNumber;
        }

        return dto;
    }
}
