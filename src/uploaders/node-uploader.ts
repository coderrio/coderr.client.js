import * as https from 'https';
import { IErrorReportDTO } from '../contracts/dto';
import * as crypto from 'crypto';
import { IReportUploader } from './interfaces';

/**
 * Uses HTTPS from NodeJS to upload a report.
 */
export class HttpsUploader implements IReportUploader {
    constructor(private url: string, private appKey: string, private sharedSecret: string) {}

    /**
     * Upload a new report.
     * @param report Report to upload
     */
    async upload(report: IErrorReportDTO): Promise<void> {
        const dataString = JSON.stringify(report);

        const hash = crypto
            .createHmac('sha256', this.sharedSecret)
            .update(dataString)
            .digest('base64');

        const url = `${this.url}receiver/report/${this.appKey}/?sig=${hash}`;
        await this.post(url, dataString);
    }

    private async post(url: string, data: string) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
            },
            timeout: 1000, // in ms
            strictSSL: true,
            rejectUnauthorized: true,
        };

        // To allow self signed certificates.
        var env = process.env.NODE_ENV || 'development';
        if (env === 'development') {
            options.strictSSL = false;
            options.rejectUnauthorized = false;
        }

        return new Promise((resolve, reject) => {
            const req = https.request(url, options, (response) => {
                if (!response) {
                    reject(new Error('Did not receive a reply.'));
                } else if (
                    response.statusCode &&
                    (response.statusCode < 200 || response.statusCode > 299)
                ) {
                    return reject(
                        new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`)
                    );
                }

                let body: Buffer[] = [];
                response.on('data', (chunk: any) => {
                    body.push(chunk);
                });
                response.on('end', () => {
                    const resString = Buffer.concat(body).toString();
                    resolve(resString);
                });
            });

            req.on('error', (err: any) => {
                reject(err);
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request time out'));
            });

            req.write(data);
            req.end();
        });
    }
}
