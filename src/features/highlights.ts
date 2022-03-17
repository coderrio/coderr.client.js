import { getCoderrCollection } from '../context-collections';
import {
    IContextCollection,
    IContextCollectionProviderContext,
} from '../context-collections/interfaces';

/**
 * Specify which context collection that should be shown per default.
 *
 * @param context Context to append the data to.
 * @param collectionName Name of the collection to show.
 */
export function highlightCollectionInContext(
    context: IContextCollectionProviderContext,
    collectionName: string
): void {
    if (!context) {
        throw new Error('context must be specified');
    }

    if (!collectionName) {
        throw new Error('collectionName must be specified');
    }

    highlightCollection(context.contextCollections, collectionName);
}

/**
 * Specify which context collection that should be shown per default.
 *
 * @param context Context to append the data to.
 * @param collectionName Name of the collection to show.
 */
export function highlightCollection(
    collections: IContextCollection[],
    collectionName: string
): void {
    if (!collections) {
        throw new Error('collections must be specified');
    }

    if (!collectionName) {
        throw new Error('collectionName must be specified');
    }

    const collection = getCoderrCollection(collections);
    collection.properties['HighlightCollections'] = collectionName;
}
