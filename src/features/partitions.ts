import { getCoderrCollection } from '../context-collections';
import {
    IContextCollection,
    IContextCollectionProviderContext,
} from '../context-collections/interfaces';

/**
 * Add something to the error summary panel for this error.
 *
 * @param context Context to append the data to.
 * @param partitionKey Key used to measure this metric (for instance 'userId' or 'tenantId')
 * @param value Unique value for this specific computer/user/customer etc.
 */
export function addPartitionToContext(
    context: IContextCollectionProviderContext,
    partitionKey: string,
    value: string
) {
    if (!context) {
        throw new Error('context must be specified');
    }

    if (!partitionKey) {
        throw new Error('partitionKey must be specified');
    }

    if (!value) {
        throw new Error('value must be specified');
    }

    addPartition(context.contextCollections, partitionKey, value);
}

/**
 * Add something to the error summary panel for this error.
 *
 * @param context Context to append the data to.
 * @param partitionKey Key used to measure this metric (for instance 'userId' or 'tenantId')
 * @param value Unique value for this specific computer/user/customer etc.
 *
 */
export function addPartition(
    collections: IContextCollection[],
    partitionKey: string,
    value: string
) {
    if (!collections) {
        throw new Error('collections must be specified');
    }

    if (!partitionKey) {
        throw new Error('partitionKey must be specified');
    }

    if (!value) {
        throw new Error('value must be specified');
    }

    var collection = getCoderrCollection(collections);
    collection.properties[`ErrPartition.${partitionKey}`] = value;
}
