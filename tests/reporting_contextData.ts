import {
    Reporter,
    Configuration,
    IReportUploaderContext,
} from '../src/reporting';
import { ErrorReportDTO, ErrorDTO } from '../src/contracts';
import { expect } from 'chai';
import 'mocha';

function generateReport() {
    const ex: ErrorDTO = {
        AssemblyName: 'a',
        FullName: 'b',
        Message: 'c',
        Properties: {},
        StackTrace: 'e',
    };
    const report: ErrorReportDTO = {
        ContextCollections: [],
        CreatedAtUtc: 'c',
        EnviromentName: 'PROD',
        Exception: ex,
        ReportId: 'b',
    };
    return report;
}

describe('Attaching contextData when reporting', () => {
    it('should able to include one contextCollection', () => {
        let myContext: IReportUploaderContext = {
            url: '',
            appKey: '',
            report: generateReport(),
        };
        const sut = new Reporter(new Configuration('aa', 'bb'), ctx => {
            myContext = ctx;
        });
        const col = {
            name: 'MyCollection',
            properties: { FirstName: 'Arne' },
        };

        sut.reportErr(new Error('SomeError'), col);

        const actual = myContext.report.ContextCollections[0];
        expect(actual).to.have.property('Name', 'MyCollection');
        expect(actual.Properties).to.have.property('FirstName', 'Arne');
    });
    it('should able to include multiple properties in a contextCollection', () => {
        let myContext: IReportUploaderContext = {
            url: '',
            appKey: '',
            report: generateReport(),
        };
        const sut = new Reporter(new Configuration('aa', 'bb'), ctx => {
            myContext = ctx;
        });
        const col = {
            name: 'MyCollection',
            properties: { FirstName: 'Arne', LastName: 'Gusten' },
        };

        sut.reportErr(new Error('SomeError'), col);

        const actual = myContext.report.ContextCollections[0];
        expect(actual).to.have.property('Name', 'MyCollection');
        expect(actual.Properties).to.have.property('FirstName', 'Arne');
        expect(actual.Properties).to.have.property('LastName', 'Gusten');
    });
    it('should able to include two contextCollection', () => {
        let myContext: IReportUploaderContext = {
            url: '',
            appKey: '',
            report: generateReport(),
        };
        const sut = new Reporter(new Configuration('aa', 'bb'), ctx => {
            myContext = ctx;
        });
        const col1 = {
            name: 'MyCollection',
            properties: { Speed: '40' },
        };
        const col2 = {
            name: 'MyCollection2',
            properties: { Direction: 'North' },
        };

        sut.reportErr(new Error('MyCollection'), [col1, col2]);

        const actual = myContext.report.ContextCollections[0];
        expect(actual).to.have.property('Name', 'MyCollection');
        expect(actual.Properties).to.have.property('Speed', '40');
        const actual2 = myContext.report.ContextCollections[1];
        expect(actual2).to.have.property('Name', 'MyCollection2');
        expect(actual2.Properties).to.have.property('Direction', 'North');
    });
    it('should able to include one object', () => {
        let myContext: IReportUploaderContext = {
            url: '',
            appKey: '',
            report: generateReport(),
        };
        const sut = new Reporter(new Configuration('aa', 'bb'), ctx => {
            myContext = ctx;
        });
        const col = {
            name: 'Name',
            Age: 99,
        };

        sut.reportErr(new Error('MyCollection'), col);

        const actual = myContext.report.ContextCollections[0];
        expect(actual).to.have.property('Name', 'ContextData');
        expect(actual.Properties).to.have.property('Age', '99');
    });
    it('should able to include multiple properties in an object', () => {
        let myContext: IReportUploaderContext = {
            url: '',
            appKey: '',
            report: generateReport(),
        };
        const sut = new Reporter(new Configuration('aa', 'bb'), ctx => {
            myContext = ctx;
        });
        const col = {
            name: 'Name',
            Age: 99,
        };

        sut.reportErr(new Error('MyCollection'), col);

        const actual = myContext.report.ContextCollections[0];
        expect(actual).to.have.property('Name', 'ContextData');
        expect(actual.Properties).to.have.property('Age', '99');
        expect(actual.Properties).to.have.property('name', 'Name');
    });
    it('should able to include two objects', () => {
        let myContext: IReportUploaderContext = {
            url: '',
            appKey: '',
            report: generateReport(),
        };
        const sut = new Reporter(new Configuration('aa', 'bb'), ctx => {
            myContext = ctx;
        });
        const col = {
            name: 'Name',
            Age: 99,
        };
        const col2 = {
            data: false,
            fast: true,
        };

        sut.reportErr(new Error('MyCollection'), [col, col2]);

        const actual = myContext.report.ContextCollections[0];
        expect(actual).to.have.property('Name', 'ContextData');
        expect(actual.Properties).to.have.property('Age', '99');
        const actual2 = myContext.report.ContextCollections[1];
        expect(actual2).to.have.property('Name', 'ContextData2');
        expect(actual2.Properties).to.have.property('data', 'false');
    });
});
