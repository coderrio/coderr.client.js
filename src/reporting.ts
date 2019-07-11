import {
    ContextCollectionProviderContext,
    ContextCollection,
    ContextCollectionProvider,
    ErrorReportContextFactory,
} from './interfaces';
import { detectDeveloperTools, uniqueid } from './functions';
import {
    ErrorReportDTO,
    ContextCollectionDTO,
    ErrorDTO,
    DictionaryDTO,
} from './contracts';

export class VanillaContext implements ContextCollectionProviderContext {
    public contextType = 'Vanilla';
    public contextCollections: ContextCollection[] = [];

    constructor(public source: any, public error: Error) {}
}

export class Configuration {
    /**
     * Context collection providers that have been registered.
     */
    public providers: ContextCollectionProvider[] = [];

    /** Name of the environment that the application is
     *  running in, like "Production", "Development" etc
     */
    public environmentName: string = '';

    /** To the root folder of Coderr Server. For example http://coderr.yourdomain.com/ */
    public serverUrl: string;

    /**
     * App key from Coderr Server
     */
    public appKey: string;

    public contextFactories: ErrorReportContextFactory[] = [];

    constructor(serverUrl: string, appKey: string) {
        this.serverUrl = serverUrl;
        this.appKey = appKey;
    }
}

export class Reporter {
    public static instance: Reporter;

    constructor(private configuration: Configuration) {
        if (
            this.configuration.environmentName === '' &&
            detectDeveloperTools()
        ) {
            this.configuration.environmentName = 'Development';
        }
    }

    public reportErr(error: Error) {
        let ctx: ContextCollectionProviderContext = new VanillaContext(
            this,
            error
        );

        this.configuration.contextFactories.forEach((element) => {
            if (!element.canHandle(this, error)) {
                return;
            }
            ctx = element.createContext(this, error);
        });

        this.reportByContext(ctx);
    }

    public reportByContext(context: ContextCollectionProviderContext) {
        const allCollections: ContextCollection[] = [];
        allCollections.push(...context.contextCollections);
        this.configuration.providers.forEach((provider) => {
            const collections = provider.collect(context);
            allCollections.push(...collections);
        });

        const report: ErrorReportDTO = {
            ReportId: uniqueid(),
            CreatedAtUtc: new Date().toISOString(),
            EnviromentName: this.configuration.environmentName,
            Exception: this.convertErrorToDto(context.error),
            ContextCollections: this.convertCollections(allCollections),
        };

        this.upload(report);
    }

    private upload(report: ErrorReportDTO) {
        const url = `${this.configuration.serverUrl}receiver/report/${this.configuration.appKey}/`;
        const httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', url, true);
        httpRequest.setRequestHeader('Content-type', 'application/json');
        httpRequest.setRequestHeader('X-Library', 'javascript');

        const data = JSON.stringify(report);
        httpRequest.send(data);
    }

    private convertCollections(
        collections: ContextCollection[]
    ): ContextCollectionDTO[] {
        const dtos: ContextCollectionDTO[] = [];
        collections.forEach((item) => {
            const dict: DictionaryDTO = {};
            item.properties.forEach((x) => (dict[x.name] = x.value));

            const dto: ContextCollectionDTO = {
                Name: item.name,
                Properties: dict,
            };
            dtos.push(dto);
        });
        return dtos;
    }

    private convertErrorToDto(error: Error): ErrorDTO {
        const dto: ErrorDTO = {
            FullName: error.name,
            Message: error.message,
            StackTrace: error.stack as string,
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
