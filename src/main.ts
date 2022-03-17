import { IReporter } from './reports/interfaces';
import { IReportUploader } from './uploaders/interfaces';
import { IContextCollectionProviderContext } from './context-collections/interfaces';
import { Reporter } from './reports/reporting';

export * from './error';

import { Configuration, IConfiguration, IPipeline, IPlugin } from './config/configuration';
export * from './config';

import * as contracts from './contracts/dto';
export { contracts };

import * as features from './features';
export { features };

import * as utilities from './utilities';
export { utilities };

import * as contextCollections from './context-collections';
export { contextCollections };

export type uploaderFactory = (url: string, key: string, secret?: string) => IReportUploader;
let ourFactory: uploaderFactory;

export * from "./reports/report-filter";

export function setUploaderFactory(factory: uploaderFactory) {
    if (!factory) {
        throw new Error('Factory must be specified.');
    }
    ourFactory = factory;
}

class Pipeline implements IPipeline {
    private reporter?: IReporter;
    private initializedPlugins: IPlugin[] = [];

    constructor() {
        console.log('Created pipeline');
        this.configuration = new Configuration((a,b,c) => this.assignCredentials(a,b,c));
    }

    configuration: IConfiguration;

    report(error: Error, contextData?: any): void {
        this.ensureInitialized();

     
        this.reporter?.report(error, contextData);
    }

    reportByContext(context: IContextCollectionProviderContext): void {
        this.ensureInitialized();
        this.reporter?.reportByContext(context);
    }

    private assignCredentials(url: string, key: string, secret?: string) {
        var uploader = ourFactory(url, key, secret);
        this.reporter = new Reporter(this.configuration, uploader);
        this.ensureInitialized();
    }

    private ensureInitialized(){
        this.configuration.plugins.forEach(x=>{
            if (this.initializedPlugins.includes(x)){
                return;
            }

            x.register(this);
            this.initializedPlugins.push(x);
        })
    }
}

const err = new Pipeline();
export { err };
