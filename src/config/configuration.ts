import { IErrorReportDTO } from '../contracts/dto';
import {
    IContextCollectionProvider,
    IContextCollectionProviderContext,
} from '../context-collections/interfaces';
import { IReportFilter } from '../reports/report-filter';
import { PartitionContext } from './partitions';

/**
 * Used internally to configure the uploader
 */
export type credentialsAssigner = (url: string, key: string, secret?: string) => void;

/**
 * Used to process all errors before they are uploaded.
 *
 * Normally used to attach information to error some/all reports.
 * Is executed after all contextCollectionProviders.
 *
 * @param context Contains information about the error.
 */
export type errorPreProcessor = (context: IContextCollectionProviderContext) => void;

/**
 * Used to process error reports before they go through the Coderr pipeline. (@see Configuration.errorPreProcessor)
 */
export type reportPreProcessor = (report: IErrorReportDTO) => void;

/**
 * Partitions are used to generate business metrics. This function type allows you to attach partitions to outbound error reports through the @see Configuration.addPartitionProvider
 */
export type partitionProvider = (context: PartitionContext) => void;

/**
 * Tells failure that happened internally in Coderr (to avoid that it affects the application when something fails).
 *
 * Typically configuration or connectivity issues.
 */
export type errorPipe = (failureMessage: string) => void;

/**
 * Configuration object for the Coderr client.
 */
export interface IConfiguration {
    /**
     * How to connect and authenticate against the Coderr server.
     * @param coderrServerAddress https://report.coderr.io for the cloud service, otherwise your local server address.
     * @param appKey Found in the Server UI
     * @param sharedSecret Found in the Server UI. Mandatory for NodeJS but should not be specified in browser based applications (whitelist your server IPs).
     */
    credentials(coderrServerAddress: string, appKey: string, sharedSecret?: string): void;

    /**
     * Context collection providers that have been registered.
     */
    contextProviders: IContextCollectionProvider[];

    /** Name of the environment that the application is
     *  running in, like "Production", "Development" etc
     */
    environmentName: string;

    /** Currently running application version */
    applicationVersion: string;

    /** Function used to process all error reports just before they are uploaded.  */
    errorPreProcessor?: errorPreProcessor;

    /**
     * Filters are used to decide whether reporters can be uploaded to the Coderr service or not.
     */
    filters: IReportFilter[];

    /**
     * Amount of properties that a context collection can contain.
     *
     * Coderr can convert any object to a context collection. However, some objects are fairly large
     * and converting everything is not suitable and will only fill your account with unnecessary data.
     *
     * This property can limit the automatic conversion to save data.
     */
    maxNumberOfPropertiesPerCollection: number;

    /**
     * Got trouble reporting? Listen on this.
     */
    errorLog?: errorPipe;

    /**
     * Used to add business metric values (like userIds) to error reports.
     * @param provider Function which will add the metric value.
     */
    partitionProviders: partitionProvider[];

    /**
     * Registered plugins which can generate errors.
     */
    plugins: IPlugin[];

    /**
     * Validate the configuration to make sure that everything is valid.
     */
    validate(): void;
}

/**
 * Coderr configuration.
 */
export class Configuration implements IConfiguration {
    constructor(private assigner: credentialsAssigner) {
    }

    plugins: IPlugin[] = [];

    validate(): void {
        this.validateArray('plugins', this.plugins);
        this.validateArray('contextProviders', this.contextProviders);
        this.validateArray('filters', this.filters);
        this.validateArray('partitionProviders', this.partitionProviders);
    }

    private validateArray(name: string, items: any[]) {
        if (!items) {
            throw new Error(name + ' have been unset.');
        }
        items.forEach((v, i) => {
            if (!v) {
                throw new Error('Item ' + i + ' in ' + name + ' is undefined.');
            }
        });

        if (this.environmentName != '' && !this.environmentName) {
            throw new Error('environmentName must be specified');
        }

        if (this.applicationVersion != '' && !this.applicationVersion) {
            throw new Error('applicationVersion must be specified');
        }

        if (!this.maxNumberOfPropertiesPerCollection) {
            this.maxNumberOfPropertiesPerCollection = 100;
        }
    }

    credentials(coderrServerAddress: string, appKey: string, sharedSecret?: string): void {
        if (coderrServerAddress.substring(-1, 1) !== '/') {
            coderrServerAddress = coderrServerAddress + '/';
        }

        this.assigner(coderrServerAddress, appKey, sharedSecret);
    }

    /**
     * Context collection providers that have been registered.
     */
    contextProviders: IContextCollectionProvider[] = [];

    /** Name of the environment that the application is
     *  running in, like "Production", "Development" etc
     */
    environmentName = '';

    /** Currently running application version */
    applicationVersion = '';

    /** Function used to process all error reports just before they are uploaded.  */
    errorPreProcessor?: errorPreProcessor;

    /**
     * Filters are used to decide whether reporters can be uploaded to the Coderr service or not.
     */
    filters: IReportFilter[] = [];

    /**
     * Amount of properties that a context collection can contain.
     *
     * Coderr can convert any object to a context collection. However, some objects are fairly large
     * and converting everything is not suitable and will only fill your account with unnecessary data.
     *
     * This property can limit the automatic conversion to save data.
     */
    maxNumberOfPropertiesPerCollection = 100;

    /**
     * Got trouble reporting? Listen on this.
     */
    errorLog?: errorPipe;

    /**
     * Used to add business metric values (like userIds) to error reports.
     * @param provider Function which will add the metric value.
     */
    partitionProviders: partitionProvider[] = [];
}

export interface IPipeline {
    configuration: IConfiguration;
    report(error: Error, contextData?: any): void;
    reportByContext(context: IContextCollectionProviderContext): void;
}

export interface IPlugin {
    /**
     * Register the plugin in the system.
     *
     * @param pipeline Used to report errors.
     */
    register(pipeline: IPipeline): void;
}
