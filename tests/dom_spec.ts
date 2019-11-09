import { expect } from 'chai';
import 'mocha';
import { JSDOM, VirtualConsole } from 'jsdom';
import { ContextCollectionProviderContext } from '../src/interfaces';
import { Configuration, Reporter } from '../src/reporting';
import { ErrorReportDTO, ErrorDTO } from '../src/contracts';
import { catchDomErrors } from '../src/dom';
declare var global: any;

const html = `<!DOCTYPE html>
<html>
    <head>
        <title>hello</title>
        <script>
            function crash()
            {
                console.log('here');
                //document.getElementById('abc').innerHTML = 'hello';
                throw new Error("Testar");
            }
        </script>
    </head>
    <body>
    </body>
</html>`;

const virtualConsole = new VirtualConsole();
virtualConsole.sendTo(console);
virtualConsole.on("error", () => { console.log('ERRRRRROR'); });
virtualConsole.on("jsdomError", (e) => {
console.log(e);
})
//virtualConsole.on("log", () => {  });

const config = new Configuration('a', 'b');
const dom = new JSDOM(html, {runScripts: "dangerously", virtualConsole});

dom.window.addEventListener('error', function(){console.log('ERROR!!')});
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

        global.window.eval('crash()');

        expect(actualContext).to.be('object');
    });
});
