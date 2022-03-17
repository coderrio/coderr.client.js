import { IErrorReportDTO } from '../contracts/dto';

/**
 * Context for @see IReportFilter
 */
export interface IReportFilterContext {
    /**
     * Report that was generated for the error.
     */
    report: IErrorReportDTO;

    /**
     * If the report can be uploaded to Coderr.
     */
    canSubmitReport: boolean;
}

/**
 * Filters are used to decide which reports are allowed to be uploaded to Coderr.
 */
export interface IReportFilter {
    /**
     * Invoke filter.
     * @param context Used to make the decision.
     */
    invoke(context: IReportFilterContext): void;
}
