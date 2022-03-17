import * as imps from './contracts/dto-implementations';
import * as m from './main';
import * as col from './context-collections';
import { FetchUploader } from './uploaders/fetch-uploader';
import { catchDomErrors } from './dom';

export * from './main';

m.setUploaderFactory((url: string, key: string) => new FetchUploader(url, key));

catchDomErrors(m.err.configuration);

(window as any).coderr = {
    ErrorReportDTO: imps.ErrorReportDTO,
    LogEntryDTO: imps.LogEntryDTO,
    ErrorDTO: imps.ErrorDto,
    toCollection: col.toCollection,
    appendToCollection: col.appendToCollection,
    getCoderrCollection: col.getCoderrCollection,
    err: m.err,
};
