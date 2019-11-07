import { expect } from 'chai';
import 'mocha';
import { JSDOM } from 'jsdom';
import { ContextCollectionProviderContext } from '../src/interfaces';
import { Configuration, Reporter } from '../src/reporting';
import { ErrorReportDTO, ErrorDTO } from '../src/contracts';
import { catchDomErrors } from '../src/dom';
declare var global: any;

const config = new Configuration('a', 'b');
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

let actualContext: ContextCollectionProviderContext;
Reporter.instance = {
    reportByContext(context) {
        actualContext = context;
    },
};

describe('DOM error event', () => {
    it('includes the document collection', () => {
        catchDomErrors(config);

        dom.window.document.body.innerHTML = '<script>a = 10 / 0;</script>';

        expect(actualContext).to.be('object');
    });
});
