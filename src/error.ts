import { IContextCollection, StringDictionary } from './context-collections';

/**
 * Error with Coderr details.
 */
export class CoderrError extends Error {
    constructor(message: string) {
        super(message);
    }

    /**
     * Inner error (might be a caught one in a try/catch block).
     */
    inner?: Error;

    /**
     *
     */
    contextData: any | IContextCollection[];

    /**
     * Tags which can be used whens searching for this error in the Coderr UI.
     */
    tags: string[] = [];

    /**
     * In the UI, show the following collection per default.
     */
    showCollectionNamed?: string;

    /**
     * Values used to calculate business impact.
     */
    partitions: StringDictionary = {};

    /**
     * Shown in the information box in Coderr.
     */
    facts: StringDictionary = {};

    /**
     * Used to relate errors, for instance backend and front-end errors.
     */
    correlationId?: string;
}
