import { IContextCollectionProviderContext } from '../context-collections/interfaces';
import { IContextCollectionDTO } from '../contracts/dto';

/**
 * Context used to add partitions (i.e. business metric values).
 */
export class PartitionContext {
    constructor(
        public coderrCollection: IContextCollectionDTO,
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
    addPartition(partitionKey: string, value: string) {
        if (!partitionKey) {
            throw new Error('partitionKey must be specified.');
        }
        this.coderrCollection.Properties[`ErrPartition.${partitionKey}`] = value;
    }
}
