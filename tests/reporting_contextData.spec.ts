import { Reporter } from '../src/reports/reporting';
import { IReportUploader } from '../src/uploaders/interfaces';
import { Configuration } from '../src/config/configuration';
import { IErrorReportDTO, IErrorDTO } from '../src/contracts/dto';

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
generateReport();

class FakeUploader implements IReportUploader {
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
let credentialsAssigner = (u:string, k:string, s?:string) => {
    console.log(u,k,s);
};

describe('Attaching contextData when reporting', () => {
    test('should able to include one contextCollection', () => {
        const uploader = new FakeUploader();
        const sut = new Reporter(new Configuration(credentialsAssigner), uploader);
        const col = {
            name: 'MyCollection',
            properties: { FirstName: 'Arne' },
        };

        sut.report(new Error('SomeError'), col);

        const actual = uploader.report.ContextCollections[0];
        expect(actual).toHaveProperty('Name', 'MyCollection');
        expect(actual.Properties).toHaveProperty('FirstName', 'Arne');
    });

    test('should able to include multiple properties in a contextCollection', () => {
        const uploader = new FakeUploader();
        const sut = new Reporter(new Configuration(credentialsAssigner), uploader);
        const col = {
            name: 'MyCollection',
            properties: { FirstName: 'Arne', LastName: 'Gusten' },
        };

        sut.report(new Error('SomeError'), col);

        const actual = uploader.report.ContextCollections[0];
        expect(actual).toHaveProperty('Name', 'MyCollection');
        expect(actual.Properties).toHaveProperty('FirstName', 'Arne');
        expect(actual.Properties).toHaveProperty('LastName', 'Gusten');
    });

    test('should able to include two contextCollection', () => {
        const uploader = new FakeUploader();
        const sut = new Reporter(new Configuration(credentialsAssigner), uploader);
        const col1 = {
            name: 'MyCollection',
            properties: { Speed: '40' },
        };
        const col2 = {
            name: 'MyCollection2',
            properties: { Direction: 'North' },
        };

        sut.report(new Error('MyCollection'), [col1, col2]);

        const actual = uploader.report.ContextCollections[0];
        expect(actual).toHaveProperty('Name', 'MyCollection');
        expect(actual.Properties).toHaveProperty('Speed', '40');
        const actual2 = uploader.report.ContextCollections[1];
        expect(actual2).toHaveProperty('Name', 'MyCollection2');
        expect(actual2.Properties).toHaveProperty('Direction', 'North');
    });

    test('should able to include one collection in an array', () => {
        const uploader = new FakeUploader();
        const sut = new Reporter(new Configuration(credentialsAssigner), uploader);
        const col1 = {
            name: 'MyCollection',
            properties: { Speed: '40' },
        };

        sut.report(new Error('MyCollection'), [col1]);

        const actual = uploader.report.ContextCollections[0];
        expect(actual).toHaveProperty('Name', 'MyCollection');
        expect(actual.Properties).toHaveProperty('Speed', '40');
    });

    test('should able to include one object', () => {
        const uploader = new FakeUploader();
        const sut = new Reporter(new Configuration(credentialsAssigner), uploader);
        const col = {
            name: 'Name',
            Age: 99,
        };

        sut.report(new Error('MyCollection'), col);

        const actual = uploader.report.ContextCollections[0];
        expect(actual).toHaveProperty('Name', 'ContextData');
        expect(actual.Properties).toHaveProperty('Age', '99');
    });

    test('should able to include multiple properties in an object', () => {
        const uploader = new FakeUploader();
        const sut = new Reporter(new Configuration(credentialsAssigner), uploader);
        const col = {
            name: 'Name',
            Age: 99,
        };

        sut.report(new Error('MyCollection'), col);

        const actual = uploader.report.ContextCollections[0];
        expect(actual).toHaveProperty('Name', 'ContextData');
        expect(actual.Properties).toHaveProperty('Age', '99');
        expect(actual.Properties).toHaveProperty('name', 'Name');
    });

    test('should able to include two objects', () => {
        const uploader = new FakeUploader();
        const sut = new Reporter(new Configuration(credentialsAssigner), uploader);
        const col = {
            name: 'Name',
            Age: 99,
        };
        const col2 = {
            data: false,
            fast: true,
        };

        sut.report(new Error('MyCollection'), [col, col2]);

        const actual = uploader.report.ContextCollections[0];
        expect(actual).toHaveProperty('Name', 'ContextData');
        expect(actual.Properties).toHaveProperty('Age', '99');
        const actual2 = uploader.report.ContextCollections[1];
        expect(actual2).toHaveProperty('Name', 'ContextData2');
        expect(actual2.Properties).toHaveProperty('data', 'false');
    });
});
