import { IErrorReportDTO } from '../contracts/dto';

/**
 * Configuration for @see IReportUploader
 */
export interface IReportUploaderConfig {
    /**
     * Coderr server url.
     */
    url: string;

    /** Used to identity which application this error report is for. */
    appKey: string;

    /**
     * Should not be used for browser based applications (since it's visible for all)
     *
     * Instead, add your web servers to the whitelist in Coderr.
     */
    sharedSecret?: string;
}

/**
 * Upload reports to Coderr (any type of queueing should be done before invoking this uploader).
 */
export interface IReportUploader {
    /**
     * Upload report.
     * @param report Report to upload.
     */
    upload(report: IErrorReportDTO): Promise<void>;
}

/**
 * Factory used to create a report uploader (to allow us to switch implementation depending on the type iof environment).
 */
export declare type ReportUploaderFactory = (config: IReportUploaderConfig) => IReportUploader;
