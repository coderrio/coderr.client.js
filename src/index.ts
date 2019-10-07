// export * from './interfaces';
// export * from './contracts';
export {toCollection} from './functions';
// export {catchDomErrors} from './dom';
export { Configuration } from './reporting';
export { ErrorReportDTO } from './contracts';

import { Configuration, Reporter } from './reporting';
import { catchDomErrors as d } from './dom';

export class Coderr {
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
