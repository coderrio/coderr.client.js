export interface StringDictionary {
    [key: string]: string;
}

/**
 * Contains a specific data set in an error report.
 *
 * A context collection represents a certain type of information
 * that is included in an error report.
 * A collection might contain everything from the document object or the UserAgent
 */
export interface ContextCollection {
    /** Name of the collection, like "document" */
    name: string;

    /** Collected properties for the colllection. */
    properties: StringDictionary;
}

/**
 * Context for @see ContextCollectionProvider
 */
export interface ContextCollectionProviderContext {
    /**
     * Type of provider context, for instance "DOM" or "Vue"
     */
    contextType: string;

    /**
     * Object that detected the error.
     */
    source: any;

    /**
     * Caught error.
     */
    error: Error;

    /**
     * One or more collections that either were provided when the error was reported.
     */
    contextCollections: ContextCollection[];
}

/**
 * Context collection provider.
 *
 * Providers are invoked when we want to know why an error.
 */
export interface ContextCollectionProvider {
    /**
     * Collect information
     * @param context Different types of contexts can be passed to the method depending on
     *                where the error was caught. For instance @see VueErrorContext
     *                or @see DomErrorContext.
     *                The context.contextType property identifies the type of context.
     * @returns empty array if no information was collected
     */
    collect(context: ContextCollectionProviderContext): ContextCollection[];
}

/** Generates the context with is passed through the pipeline to collect context collections */
export interface ErrorReportContextFactory {
    canHandle(source: any, error: Error): boolean;
    createContext(source: any, error: Error): ContextCollectionProviderContext;
}
