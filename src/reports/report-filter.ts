import { IErrorReportDTO } from '../contracts/dto';

/**
 * Context for @see IReportFilter
 */
export class ReportFilterContext {
    constructor(public report: IErrorReportDTO) {
        if (!report) {
            throw new Error('Report must be specified.');
        }
    }

    /**
     * If the report can be uploaded to Coderr.
     */
    canSubmitReport = true;
}

/**
 * Filters are used to decide which reports are allowed to be uploaded to Coderr.
 */
export interface IReportFilter {
    /**
     * Invoke filter.
     * @param context Used to make the decision.
     */
    invoke(context: ReportFilterContext): void;
}
