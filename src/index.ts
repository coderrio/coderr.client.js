// export * from './interfaces';
// export * from './contracts';
export {toCollection} from './functions';
// export {catchDomErrors} from './dom';
export { Configuration } from './reporting';

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

    public report(error: Error) {
        this.reporter.reportErr(error);
    }
}

// (window as any).coderr = createCoderr;
