import { getCoderrCollection } from '../context-collections';
import {
    IContextCollection,
    IContextCollectionProviderContext,
} from '../context-collections/interfaces';

/**
 * Add a tag to a context collection (which can then be used in the Coderr UI to find errors).
 *
 * Looks if the `ErrTags` property exists and either appends a tag or create the property.
 *
 * @param collection Collection to add a tag to.
 * @param tagName Tag to add.
 */
export function addTagToContext(context: IContextCollectionProviderContext, tagName: string): void {
    if (!context) {
        throw new Error('context must be specified');
    }

    if (!tagName) {
        throw new Error('tagName must be specified');
    }

    addTag(context.contextCollections, tagName);
}

/**
 * Add a tag to the Coderr collection (which contains Coderr specific instructions.)
 *
 * Looks for the collection called `CoderrData', will create it if missing.
 * Looks if the `ErrTags` property exists and either appends a tag or create the property.
 *
 * @param collections An array of collections.
 * @param tagName Tag to add.
 */
export function addTag(collections: IContextCollection[], tagName: string): void {
    if (!collections) {
        throw new Error('collections must be specified');
    }

    if (!tagName) {
        throw new Error('tagName must be specified');
    }

    const collection = getCoderrCollection(collections);
    const tags = collection.properties['ErrTags'];
    if (!tags) {
        collection.properties['ErrTags'] = tagName;
    } else {
        collection.properties['ErrTags'] = tags + ',' + tagName;
    }
}
