import { IReporter } from './reports/interfaces';
import { IReportUploader } from './uploaders/interfaces';
import { IContextCollectionProviderContext } from './context-collections/interfaces';
import { Reporter } from './reports/reporting';
import { Configuration } from './config/configuration';

import * as contracts from './contracts/dto';
export { contracts };

import * as features from './features';
export { features };

import * as utilities from './utilities';
export { utilities };

import * as contextCollections from './context-collections';
export { contextCollections };

var uploaderFactory: (url: string, key: string, secret?: string) => IReportUploader;
export function setUploaderFactory(
    factory: (url: string, key: string, secret?: string) => IReportUploader
) {
    if (!factory) {
        throw new Error('Factory must be specified.');
    }
    uploaderFactory = factory;
}

export var config: Configuration = new Configuration();

var reporter: IReporter;

export function credentials(
    coderrServerAddress: string,
    appKey: string,
    sharedSecret?: string
): void {
    if (coderrServerAddress.substring(-1, 1) !== '/') {
        coderrServerAddress = coderrServerAddress + '/';
    }

    var uploader = uploaderFactory(coderrServerAddress, appKey, sharedSecret);
    reporter = new Reporter(config, uploader);
}

export function report(error: Error, contextData?: any) {
    reporter.report(error, contextData);
}

export function reportByContext(context: IContextCollectionProviderContext) {
    reporter.reportByContext(context);
}
