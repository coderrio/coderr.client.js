import * as imps from './contracts/dto-implementations';
import * as m from './main';
import * as col from './context-collections';
import { FetchUploader } from './uploaders/fetch-uploader';
import { catchDomErrors } from './dom';

export * from './main';

m.setUploaderFactory((url: string, key: string) => new FetchUploader(url, key));

catchDomErrors(m.config);

(window as any).coderr = {
    configuration: m.config,
    ErrorReportDTO: imps.ErrorReportDTO,
    LogEntryDTO: imps.LogEntryDTO,
    ErrorDTO: imps.ErrorDto,
    toCollection: col.toCollection,
    appendToCollection: col.appendToCollection,
    getCoderrCollection: col.getCoderrCollection,
    credentials: m.credentials,
    report: m.report,
    reportByContext: m.reportByContext,
};
