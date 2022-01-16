import { IErrorReportDTO } from '../contracts/dto';
import {
    IContextCollectionProvider,
    IContextCollectionProviderContext,
} from '../context-collections/interfaces';
import { IReportFilter } from '../reports/report-filter';
import { PartitionContext } from './partitions';

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
 * Coderr configuration.
 */
export class Configuration {
    /**
     * Context collection providers that have been registered.
     */
    providers: IContextCollectionProvider[] = [];

    /** Name of the environment that the application is
     *  running in, like "Production", "Development" etc
     */
    environmentName: string = '';

    /** Currently running application version */
    applicationVersion: string = '';

    /** Function used to process all error reports just before they are uploaded.  */
    errorPreProcessor?: errorPreProcessor;

    /**
     * Filters are used to decide whether reporters can be uploaded to the Coderr service or not.
     */
    filter: IReportFilter[] = [];

    /**
     * Amount of properties that a context collection can contain.
     *
     * Coderr can convert any object to a context collection. However, some objects are fairly large
     * and converting everything is not suitable and will only fill your account with unnecessary data.
     *
     * This property can limit the automatic conversion to save data.
     */
    maxNumberOfPropertiesPerCollection: number = 100;

    /**
     * Got trouble reporting? Listen on this.
     */
    coderrErrorLog?: errorPipe;

    /**
     * Used to add business metric values (like userIds) to error reports.
     * @param provider Function which will add the metric value.
     */
    addPartitionProvider(provider: partitionProvider): void {
        if (!provider) {
            throw new Error('provider must be specified.');
        }
        partitionProviders.push(provider);
    }
}

export var partitionProviders: partitionProvider[] = [];
