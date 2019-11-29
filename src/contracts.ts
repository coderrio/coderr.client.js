export interface DictionaryDTO {
    [key: string]: string;
}

export interface ContextCollectionDTO {
    Name: string;
    Properties: DictionaryDTO;
}

export interface ErrorDTO {
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
    Properties: DictionaryDTO;

    /** Stack trace */
    StackTrace: string;
}

/**
 * DTO used when sending the report to the Coderr server.
 * Names are from the Coderr Server API.
 */
export interface ErrorReportDTO {
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
    Exception: ErrorDTO;

    ContextCollections: ContextCollectionDTO[];
}
