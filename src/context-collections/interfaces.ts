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
export interface IContextCollection {
    /** Name of the collection, like "document" */
    name: string;

    /** Collected properties for the collection. */
    properties: StringDictionary;
}

/**
 * Log entries can be attached to an error. Only at most 100 log entries are processed by coderr (i.e. only attach the most recent before the error happened.)
 */
export interface ILogEntry {
    /**
     *  0 = trace, 1 = debug, 2 = info, 3 = warning, 4 = error, 5 = critical
     */
    logLevel: number;

    /**
     * Logged message.
     */
    message: string;

    /**
     * Type that wrote the log message.
     */
    source?: string;

    /**
     * When the entry was written (should be in ISO 8601 format, i.e. myDate.toIsoString())
     */
    timestampUtc: string;

    /** String representation of a logged error. */
    error?: string;
}

/**
 * Context for @see ContextCollectionProvider
 */
export interface IContextCollectionProviderContext {
    /**
     * Type of provider context, for instance "DOM" or "Vue"
     */
    get contextType(): string;

    /**
     * Object that detected the error.
     */
    get source(): any;

    /**
     * Caught error.
     */
    get error(): Error;

    /**
     * One or more collections that either were provided when the error was reported.
     *
     * Add additional contexts to this collection.
     */
    contextCollections: IContextCollection[];

    /**
     * Log entries that was attached to the report.
     */
    logEntries: ILogEntry[];
}

/**
 * Context collection provider.
 *
 * Providers are invoked when we want to know why an error.
 */
export interface IContextCollectionProvider {
    /**
     * Collect information
     * @param context Different types of contexts can be passed to the method depending on
     *                where the error was caught. For instance @see VueErrorContext
     *                or @see DomErrorContext.
     *                The context.contextType property identifies the type of context.
     * @returns empty array if no information was collected
     */
    collect(context: IContextCollectionProviderContext): void;
}
