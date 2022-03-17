import { getCoderrCollection } from '../context-collections';
import {
    IContextCollection,
    IContextCollectionProviderContext,
} from '../context-collections/interfaces';

/**
 * Add something to the error summary panel for this error.
 *
 * @param context Context to append the data to.
 * @param name Display name
 * @param value Value for this entry
 */
export function addQuickFactToContext(
    context: IContextCollectionProviderContext,
    name: string,
    value: string
): void {
    if (!context) {
        throw new Error('context must be specified');
    }

    if (!name) {
        throw new Error('name must be specified');
    }

    if (!value) {
        throw new Error('value must be specified');
    }

    addQuickFact(context.contextCollections, name, value);
}

/**
 * Add something to the error summary panel for this error.
 *
 * @param context Context to append the data to.
 * @param name Display name
 * @param value Value for this entry
 */
export function addQuickFact(collections: IContextCollection[], name: string, value: string): void {
    if (!collections) {
        throw new Error('collections must be specified');
    }

    if (!name) {
        throw new Error('name must be specified');
    }

    if (!value) {
        throw new Error('value must be specified');
    }

    const collection = getCoderrCollection(collections);
    collection.properties[`QuickFact.${name}`] = value;
}
