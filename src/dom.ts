import {
    ContextCollectionProviderContext,
    ContextCollection,
    ContextCollectionProvider,
    ErrorReportContextFactory,
} from './interfaces';
import { toCollection } from './functions';
import { Configuration, Reporter } from './reporting';
import * as ua from 'ua-parser-js';

export class DomErrorContext implements ContextCollectionProviderContext {
    public contextType: string = 'DOM';
    public contextCollections: ContextCollection[] = [];

    constructor(
        public source: any,
        public error: Error,
        public document: Document,
        public window: Window
    ) {}
}

class DomContextFactory implements ErrorReportContextFactory {
    public canHandle(source: any, error: Error): boolean {
        if (window) {
            return true;
        }

        return source instanceof DomErrorContext;
    }

    public createContext(
        source: any,
        error: Error
    ): ContextCollectionProviderContext {
        return new DomErrorContext(source, error, window.document, window);
    }
}

export function catchDomErrors(configuration: Configuration) {
    window.addEventListener('error', (event: ErrorEvent) => {
        const domContext = new DomErrorContext(
            event.target,
            event.error,
            window.document,
            window
        );
        Reporter.instance.reportByContext(domContext);
    });

    configuration.contextFactories.push(new DomContextFactory());
    registerDomProviders(configuration.providers);
}

function registerDomProviders(providers: ContextCollectionProvider[]) {
    providers.push(new DocumentCollectionProvider());
    providers.push(new NavigatorCollectionProvider());
    providers.push(new WindowProvider());
    providers.push(new ScreenCollectionProvider());
}

/**
 * Adds a collection named 'document' with properties from DOM document (and document.body).
 */
export class DocumentCollectionProvider implements ContextCollectionProvider {
    public collect(
        context: ContextCollectionProviderContext
    ): ContextCollection[] {
        const document = (context as DomErrorContext).document;
        if (!document) {
            return [];
        }

        let doc = null;
        if (document.body) {
            doc = toCollection('document', {
                baseURI: document.baseURI,
                characterSet: document.characterSet,
                charset: document.charset,
                contentType: document.contentType,
                cookie: document.cookie,
                body: {
                    clientHeight: document.body.clientHeight,
                    clientLeft: document.body.clientLeft,
                    clientTop: document.body.clientTop,
                    clientWidth: document.body.clientWidth,
                    baseURI: document.body.baseURI,
                    draggable: document.body.draggable,
                    inputMode: document.body.inputMode,
                    offsetHeight: document.body.offsetHeight,
                    offsetLeft: document.body.offsetLeft,
                    offsetParent: document.body.offsetParent,
                    offsetTop: document.body.offsetTop,
                    offsetWidth: document.body.offsetWidth,
                },
                fullscreenEnabled: document.fullscreenEnabled,
                compatMode: document.compatMode,
                lastModified: document.lastModified,
                location: document.location.href,
                readyState: document.readyState,
                referrer: document.referrer,
                title: document.title,
            });
        } else {
            doc = toCollection('document', {
                baseURI: document.baseURI,
                characterSet: document.characterSet,
                charset: document.charset,
                contentType: document.contentType,
                cookie: document.cookie,
                fullscreenEnabled: document.fullscreenEnabled,
                compatMode: document.compatMode,
                lastModified: document.lastModified,
                location: document.location.href,
                readyState: document.readyState,
                referrer: document.referrer,
                title: document.title,
            });
        }

        return [doc];
    }
}

export class NavigatorCollectionProvider implements ContextCollectionProvider {
    public collect(
        context: ContextCollectionProviderContext
    ): ContextCollection[] {
        const navigator = (context as DomErrorContext).window.navigator;
        if (!navigator) {
            return [];
        }

        const col = toCollection('navigator', {
            appCodeName: navigator.appCodeName,
            userAgent: navigator.userAgent,
            appName: navigator.appName,
            appVersion: navigator.appVersion,
            authentication: navigator.authentication,
            cookieEnabled: navigator.cookieEnabled,
            platform: navigator.platform,
            product: navigator.product,
            productSub: navigator.productSub,
        });

        const parser = new ua.UAParser(navigator.userAgent);
        const uaCollection = toCollection('userAgent', {
            browser: {
                name: parser.getBrowser().name,
                major: parser.getBrowser().major,
                version: parser.getBrowser().version,
            },
            OS: {
                name: parser.getOS().name,
                version: parser.getOS().version,
            },
            CPU: {
                architecture: parser.getCPU().architecture,
            },
            device: {
                model: parser.getDevice().model,
                type: parser.getDevice().type,
                version: parser.getBrowser().version,
            },
            engine: {
                name: parser.getEngine().name,
                version: parser.getEngine().version,
            },
        });

        return [col, uaCollection];
    }
}

export class ScreenCollectionProvider implements ContextCollectionProvider {
    public collect(
        context: ContextCollectionProviderContext
    ): ContextCollection[] {
        const screen = (context as DomErrorContext).window.screen;
        if (!screen) {
            return [];
        }

        const col = toCollection('screen', {
            availHeight: screen.availHeight,
            availWidth: screen.availWidth,
            colorDepth: screen.colorDepth,
            height: screen.height,
            width: screen.width,
            pixelDepth: screen.pixelDepth,
        });
        return [col];
    }
}

class WindowProvider implements ContextCollectionProvider {
    public collect(
        context: ContextCollectionProviderContext
    ): ContextCollection[] {
        const window = (context as DomErrorContext).window;
        if (!window) {
            return [];
        }

        const col = toCollection('window', {
            location: window.location.href,
            innerWidth: window.innerWidth,
            URL: window.URL,
            URLSearchParams: window.URLSearchParams,
            innerHeight: window.innerHeight,
            clientHeight: window.addEventListener,
            devicePixelRatio: window.devicePixelRatio,
            outerHeight: window.outerHeight,
            outerWidth: window.outerWidth,
            scrollX: window.scrollX,
            scrollY: window.scrollY,
        });
        return [col];
    }
}
