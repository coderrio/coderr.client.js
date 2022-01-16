import { IErrorReportDTO } from '../contracts/dto';
import { IReportUploader } from './interfaces';

/**
 * Uses fetch() to upload reports.
 */
export class FetchUploader implements IReportUploader {
    constructor(private url: string, private appKey: string) {}
    async upload(report: IErrorReportDTO): Promise<void> {
        const url = `${this.url}receiver/report/${this.appKey}/`;

        await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Library': 'javascript',
            },
            body: JSON.stringify(report),
        });
    }
}
