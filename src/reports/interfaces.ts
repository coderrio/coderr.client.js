import { IContextCollectionProviderContext } from '../context-collections/interfaces';

/**
 * Defines the service that uploads all reports to the Coderr server.
 */
export interface IReporter {
    reportByContext(context: IContextCollectionProviderContext): void;

    report(error: Error, contextData?: any): void;
}
