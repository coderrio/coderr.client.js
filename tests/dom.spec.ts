/**
 * @jest-environment jsdom
 */

import { Configuration, IReportUploader, Reporter } from '../src/reporting';
import { catchDomErrors, DomErrorContext } from '../src/dom';
import { IErrorReportDTO } from '../src/contracts';


const config = new Configuration();
let uploadedReport: IErrorReportDTO;
var uploader: IReportUploader = {
    async upload(report: IErrorReportDTO): Promise<void> {
        uploadedReport = report;
    }
}

var reporter = new Reporter(config, uploader);
Reporter.instance = reporter;

describe("DOM error event", () => {

    test("includes the document collection", () => {
        catchDomErrors(config);

        try {
            throw new Error("Hey");
        }
        catch (e) {
            const domContext = new DomErrorContext(
                this,
                <Error>e,
                window.document,
                <Window><any>window
            );
            Reporter.instance.reportByContext(domContext);
        }

        var collection = uploadedReport.ContextCollections.find(x => x.Name == "document");
        expect(collection).toMatchObject({
            Properties: {
                "body.baseURI": "http://localhost/"
            }
        });
    });


    //document.dispatchEvent(event);
    test("will pickup document error", () => {
        catchDomErrors(config);


        var e = new window.ErrorEvent('error', {
            error: new Error('AAAHHHH'),
            message: 'A monkey is throwing bananas at me!',
            lineno: 402,
            filename: 'closet.html',
            bubbles: true,
            cancelable: false

        });

        document.dispatchEvent(<ErrorEvent>e);

        expect(uploadedReport).toMatchObject({
            Exception: {
                "Message": "AAAHHHH"
            }
        });
    });

});
