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

    AssemblyName: string = '';
    FullName: string = '';
    Message: string = '';
    Properties: IDictionaryDTO = {};
    StackTrace: string = '';
}

/**
 * Default implementation for @see ILogEntryDTO
 */
export class LogEntryDTO implements ILogEntryDTO {
    Exception?: string = undefined;
    LogLevel: number = 1;
    Message: string = '';
    Source: string = '';
    TimeStampUTC: string = new Date().toISOString();
}

/**
 * Default implementation for @see IErrorReportDTO
 */
export class ErrorReportDTO implements IErrorReportDTO {
    CreatedAtUtc: string = new Date().toISOString();
    ReportId: string = '';
    EnvironmentName: string = 'Production';
    Exception: IErrorDTO = new ErrorDto();
    LogEntries?: LogEntryDTO[] = [];
    ContextCollections: IContextCollectionDTO[] = [];
}
