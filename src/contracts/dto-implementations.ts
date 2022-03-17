import {
    IErrorDTO,
    ILogEntryDTO,
    IContextCollectionDTO,
    IDictionaryDTO,
    IErrorReportDTO,
} from './dto';

/**
 * Default implementation for @see IErrorDTO
 */
export class ErrorDto implements IErrorDTO {
    constructor(error?: Error) {
        if (!error) {
            return;
        }

        this.FullName = typeof Error;
        this.Message = error.message;

        if (error.stack) {
            this.StackTrace = error.stack;
        }

        this.Properties = {};
    }

    AssemblyName = '';
    FullName = '';
    Message = '';
    Properties: IDictionaryDTO = {};
    StackTrace = '';
}

/**
 * Default implementation for @see ILogEntryDTO
 */
export class LogEntryDTO implements ILogEntryDTO {
    Exception?: string = undefined;
    LogLevel = 1;
    Message = '';
    Source = '';
    TimeStampUTC = new Date().toISOString();
}

/**
 * Default implementation for @see IErrorReportDTO
 */
export class ErrorReportDTO implements IErrorReportDTO {
    CreatedAtUtc = new Date().toISOString();
    ReportId = '';
    EnvironmentName = 'Production';
    Exception: IErrorDTO = new ErrorDto();
    LogEntries?: LogEntryDTO[] = [];
    ContextCollections: IContextCollectionDTO[] = [];
}
