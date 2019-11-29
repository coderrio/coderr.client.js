// export * from './interfaces';
// export * from './contracts';
export { toCollection, appendToCollection } from './functions';
export { ContextCollection } from './interfaces';
// export {catchDomErrors} from './dom';
export { Configuration, getCoderrCollection } from './reporting';
export { ErrorReportDTO } from './contracts';

import { Configuration, Reporter } from './reporting';
import { catchDomErrors as d } from './dom';

export class CoderrClient {
    private reporter: Reporter;

    constructor(private config: Configuration) {
        this.reporter = new Reporter(config);
    }

    public catchDomErrors() {
        d(this.config);
    }

    public report(error: Error, contextData?: any) {
        this.reporter.reportErr(error, contextData);
    }
}

// (window as any).coderr = createCoderr;
