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
import { Configuration } from '../config/configuration';
import { IReportUploader } from '../uploaders/interfaces';

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
    /**
     * Global instance used for all reporting.
     *
     * Initialize manually or create an instance of this class to assign the variable.
     */
    public static instance: IReporter;

    constructor(private configuration: Configuration, private uploader: IReportUploader) {
        if (this.configuration.environmentName === '') {
            this.configuration.environmentName = 'Development';
        }
        if (!uploader) {
            throw new Error('Uploader must be specified');
        }

        this.uploader = uploader;
    }

    public report(error: Error, contextData?: any) {
        let ctx: IContextCollectionProviderContext = new VanillaContext(this, error);
        if (contextData) {
            if (Array.isArray(contextData)) {
                contextData.forEach((x, index) => {
                    if (!x.name || !x.properties) {
                        if (index === 0) {
                            x = toCollection('ContextData', x);
                        } else {
                            x = toCollection('ContextData' + (index + 1), x);
                        }
                    }
                    ctx.contextCollections.push(x);
                });
            } else {
                let collection: IContextCollection;
                if (!contextData.name || !contextData.properties) {
                    collection = toCollection('ContextData', contextData);
                } else {
                    collection = contextData;
                }
                ctx.contextCollections.push(collection);
            }
        }
        this.reportByContext(ctx);
    }

    public reportByContext(context: IContextCollectionProviderContext) {
        this.configuration.providers.forEach((provider) => {
            provider.collect(context);
        });

        if (this.configuration.applicationVersion !== '') {
            var col = getCoderrCollection(context.contextCollections);
            col.properties['AppAssemblyVersion'] = this.configuration.applicationVersion;
        }

        const report: IErrorReportDTO = {
            ReportId: uniqueid(),
            CreatedAtUtc: new Date().toISOString(),
            EnvironmentName: this.configuration.environmentName,
            Exception: this.convertErrorToDto(context.error),
            ContextCollections: this.convertCollections(context.contextCollections),
        };

        this.upload(report);
    }

    private upload(report: IErrorReportDTO) {
        this.uploader.upload(report);
    }

    private convertCollections(collections: IContextCollection[]): IContextCollectionDTO[] {
        const dtos: IContextCollectionDTO[] = [];
        collections.forEach((item) => {
            const dict: IDictionaryDTO = {};
            for (const key in item.properties) {
                if (item.properties.hasOwnProperty(key)) {
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
        var stackTrace = error.stack;
        if (!stackTrace){
            stackTrace = "";
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
        if (dyn.hasOwnProperty('number')) {
            dto.Properties['number'] = dyn.number;
        }

        // Mozilla
        if (dyn.hasOwnProperty('fileName')) {
            dto.Properties['fileName'] = dyn.fileName;
        }
        if (dyn.hasOwnProperty('lineNumber')) {
            dto.Properties['lineNumber'] = dyn.lineNumber;
        }
        if (dyn.hasOwnProperty('columnNumber')) {
            dto.Properties['columnNumber'] = dyn.columnNumber;
        }

        return dto;
    }
}
