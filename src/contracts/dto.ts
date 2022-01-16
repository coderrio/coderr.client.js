/**
 * Dictionary definition.
 */
export interface IDictionaryDTO {
    [key: string]: string;
}

/**
 * A category of telemetry data which is attached to an error report.
 */
export interface IContextCollectionDTO {
    /**
     * Name of this category
     */
    Name: string;

    /**
     * All properties.
     */
    Properties: IDictionaryDTO;
}

/***
 * The error that this report is for.
 */
export interface IErrorDTO {
    /**
     * Name of the module where the error was raised.
     */
    AssemblyName: string;

    /** Complete name of the Error type */
    FullName: string;

    /** Actual error message */
    Message: string;

    /** Any properties attached to the error.
     * Can contain additional information which the sub class contains.
     */
    Properties: IDictionaryDTO;

    /** Stack trace */
    StackTrace: string;
}

/**
 * DTO used when sending the report to the Coderr server.
 * Names are from the Coderr Server API.
 */
export interface IErrorReportDTO {
    /**
     * Date for when the report was created
     * (to get the exact time stamp in the client and not when the
     *  report was received in the server)
     */
    CreatedAtUtc: string;

    /**
     * Identifier for this report, used to detect duplicate reporting (due to network failures etc)
     */
    ReportId: string;

    /**
     * If this error was reported in "Production", "Test" or "Development"
     * (or whatever your own environments are named).
     */
    EnvironmentName: string;

    /**
     * Error information
     */
    Exception: IErrorDTO;

    /**
     * Attached log entries if any.
     */
    LogEntries?: ILogEntryDTO[];

    /**
     * Telemetry data used to make it easier to understand and reproduce errors.
     */
    ContextCollections: IContextCollectionDTO[];
}

/**
 * DTO used to attach log entries to an error report.
 * Names are from the Coderr Server API.
 */
export interface ILogEntryDTO {
    /**
     * Error (string representation)
     */
    Exception?: string;

    /**  0 = trace, 1 = debug, 2 = info, 3 = warning, 4 = error, 5 = critical */
    LogLevel: number;

    /**
     * Logged message
     */
    Message: string;

    /**
     * Class or component that created the entry (to make it easier to follow/read log entries)
     */
    Source: string;

    /**
     * Date (iso string) for when the entry was created
     */
    TimeStampUTC: string;
}
