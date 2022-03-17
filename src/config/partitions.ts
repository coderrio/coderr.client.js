import { IContextCollection, IContextCollectionProviderContext } from '../context-collections/interfaces';

/**
 * Context used to add partitions (i.e. business metric values).
 */
export class PartitionContext {
    constructor(
        public coderrCollection: IContextCollection,
        public providerContext: IContextCollectionProviderContext
    ) {
        if (!coderrCollection) {
            throw new Error('partitionKey must be specified.');
        }
        if (!providerContext) {
            throw new Error('providerContext must be specified.');
        }
    }

    /**
     * Add a new partition value to a report.
     * @param partitionKey Key used to measure this metric (for instance 'userId' or 'tenantId')
     * @param value Unique value for this specific computer/user/customer etc.
     */
    addPartition(partitionKey: string, value: string): void {
        if (!partitionKey) {
            throw new Error('partitionKey must be specified.');
        }
        this.coderrCollection.properties[`ErrPartition.${partitionKey}`] = value;
    }
}
