import {
    Reporter,
    Configuration,
    IReportUploader,
} from '../src/reporting';
import { IErrorReportDTO, IErrorDTO } from '../src/contracts';

function generateReport() {
    const ex: IErrorDTO = {
        AssemblyName: 'a',
        FullName: 'b',
        Message: 'c',
        Properties: {},
        StackTrace: 'e',
    };
    const report: IErrorReportDTO = {
        ContextCollections: [],
        CreatedAtUtc: 'c',
        EnvironmentName: 'PROD',
        Exception: ex,
        ReportId: 'b',
    };
    return report;
}


class FakeUploader implements IReportUploader{
    async upload(report: IErrorReportDTO): Promise<void> {
        this.report = report;
    }
    report: IErrorReportDTO = {
        CreatedAtUtc: '',
        ReportId: '',
        EnvironmentName: '',
        Exception: {
            AssemblyName: '',
            FullName: '',
            Message: '',
            Properties: {},
            StackTrace: ''
        },
        ContextCollections: []
    };

}

describe('Attaching contextData when reporting', () => {
    test('should able to include one contextCollection', () => {
        const uploader = new FakeUploader();
        const sut = new Reporter(new Configuration(), uploader);
        const col = {
            name: 'MyCollection',
            properties: { FirstName: 'Arne' },
        };

        sut.reportErr(new Error('SomeError'), col);

        const actual = uploader.report.ContextCollections[0];
        expect(actual).toHaveProperty('Name', 'MyCollection');
        expect(actual.Properties).toHaveProperty('FirstName', 'Arne');
    });
    test('should able to include multiple properties in a contextCollection', () => {
        const uploader = new FakeUploader();
        const sut = new Reporter(new Configuration(), uploader);
        const col = {
            name: 'MyCollection',
            properties: { FirstName: 'Arne', LastName: 'Gusten' },
        };

        sut.reportErr(new Error('SomeError'), col);

        const actual = uploader.report.ContextCollections[0];
        expect(actual).toHaveProperty('Name', 'MyCollection');
        expect(actual.Properties).toHaveProperty('FirstName', 'Arne');
        expect(actual.Properties).toHaveProperty('LastName', 'Gusten');
    });
    test('should able to include two contextCollection', () => {
        const uploader = new FakeUploader();
        const sut = new Reporter(new Configuration(), uploader);
        generateReport();
        const col1 = {
            name: 'MyCollection',
            properties: { Speed: '40' },
        };
        const col2 = {
            name: 'MyCollection2',
            properties: { Direction: 'North' },
        };

        sut.reportErr(new Error('MyCollection'), [col1, col2]);

        const actual = uploader.report.ContextCollections[0];
        expect(actual).toHaveProperty('Name', 'MyCollection');
        expect(actual.Properties).toHaveProperty('Speed', '40');
        const actual2 = uploader.report.ContextCollections[1];
        expect(actual2).toHaveProperty('Name', 'MyCollection2');
        expect(actual2.Properties).toHaveProperty('Direction', 'North');
    });
    test('should able to include one object', () => {
        const uploader = new FakeUploader();
        const sut = new Reporter(new Configuration(), uploader);
        const col = {
            name: 'Name',
            Age: 99,
        };

        sut.reportErr(new Error('MyCollection'), col);

        const actual = uploader.report.ContextCollections[0];
        expect(actual).toHaveProperty('Name', 'ContextData');
        expect(actual.Properties).toHaveProperty('Age', '99');
    });
    test('should able to include multiple properties in an object', () => {
        const uploader = new FakeUploader();
        const sut = new Reporter(new Configuration(), uploader);
        const col = {
            name: 'Name',
            Age: 99,
        };

        sut.reportErr(new Error('MyCollection'), col);

        const actual = uploader.report.ContextCollections[0];
        expect(actual).toHaveProperty('Name', 'ContextData');
        expect(actual.Properties).toHaveProperty('Age', '99');
        expect(actual.Properties).toHaveProperty('name', 'Name');
    });
    test('should able to include two objects', () => {
        const uploader = new FakeUploader();
        const sut = new Reporter(new Configuration(), uploader);
        const col = {
            name: 'Name',
            Age: 99,
        };
        const col2 = {
            data: false,
            fast: true,
        };

        sut.reportErr(new Error('MyCollection'), [col, col2]);

        const actual = uploader.report.ContextCollections[0];
        expect(actual).toHaveProperty('Name', 'ContextData');
        expect(actual.Properties).toHaveProperty('Age', '99');
        const actual2 = uploader.report.ContextCollections[1];
        expect(actual2).toHaveProperty('Name', 'ContextData2');
        expect(actual2.Properties).toHaveProperty('data', 'false');
    });
});
