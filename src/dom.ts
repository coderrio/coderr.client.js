import {
    IContextCollectionProviderContext,
    IContextCollection,
    IContextCollectionProvider,
    ILogEntry,
} from './context-collections/interfaces';
import { Reporter } from './reports/reporting';
import * as ua from 'ua-parser-js';
import { Configuration } from './config/configuration';
import { toCollection } from './context-collections';
/**
 * Used to provide access to DOM specific information when collecting telemetry.
 */
export class DomErrorContext implements IContextCollectionProviderContext {
    public contextType: string = 'DOM';
    public contextCollections: IContextCollection[] = [];

    constructor(
        public source: any,
        public error: Error,
        public document: Document,
        public window: Window
    ) {}
    logEntries: ILogEntry[] = [];
}

var registered = false;

/**
 * Tell Coderr to automatically report DOM errors to the server for further analysis.
 * @param configuration The config instance.
 */
export function catchDomErrors(configuration: Configuration) {
    if (registered) {
        return;
    }
    registered = true;

    document.addEventListener('error', (event: ErrorEvent) => {
        const domContext = new DomErrorContext(event.target, event.error, window.document, window);
        Reporter.instance.reportByContext(domContext);
    });
    window.addEventListener('error', (event: ErrorEvent) => {
        const domContext = new DomErrorContext(event.target, event.error, window.document, window);
        Reporter.instance.reportByContext(domContext);
    });

    registerDomProviders(configuration.providers);
}

/***
 * Register telemetry providers that collects DOM specific data (about the browser, document, screen size etc).
 */
function registerDomProviders(providers: IContextCollectionProvider[]) {
    providers.push(new DocumentCollectionProvider());
    providers.push(new NavigatorCollectionProvider());
    providers.push(new WindowProvider());
    providers.push(new ScreenCollectionProvider());
}

/**
 * Adds a collection named 'document' with properties from DOM document (and document.body).
 */
export class DocumentCollectionProvider implements IContextCollectionProvider {
    public collect(context: IContextCollectionProviderContext): void {
        const document = (context as DomErrorContext).document;
        if (!document) {
            return;
        }

        let doc = null;
        if (document.body) {
            doc = toCollection('document', {
                baseURI: document.baseURI,
                characterSet: document.characterSet,
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

        context.contextCollections.push(doc);
    }
}

/**
 * Collects userAgent data (version, language, vendor,  if cookies are enabled) and userAgent data (CPU, OS, browser, device)
 */
export class NavigatorCollectionProvider implements IContextCollectionProvider {
    public collect(context: IContextCollectionProviderContext): void {
        const window = (context as DomErrorContext).window;
        if (!window || !window.navigator) {
            return;
        }
        const navigator = window.navigator;

        const col = toCollection('navigator', {
            userAgent: navigator.userAgent,
            cookieEnabled: navigator.cookieEnabled,
            language: navigator.language,
            vendor: navigator.vendor,
        });
        context.contextCollections.push(col);

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
        context.contextCollections.push(uaCollection);
    }
}

/**
 * Collects information about the screen (total width/height, available width/height, pixelDepth, colorDepth).
 */
export class ScreenCollectionProvider implements IContextCollectionProvider {
    public collect(context: IContextCollectionProviderContext): void {
        const window = (context as DomErrorContext).window;
        if (!window || !window.screen) {
            return;
        }
        const screen = window.screen;

        const col = toCollection('screen', {
            availHeight: screen.availHeight,
            availWidth: screen.availWidth,
            colorDepth: screen.colorDepth,
            height: screen.height,
            width: screen.width,
            pixelDepth: screen.pixelDepth,
        });
        context.contextCollections.push(col);
    }
}

/**
 * Collects information about the window (location, inner width/height, pixelRatio, isFullScreen, name, outer width/height, screen x/y, scroll x/y, if toolbar/status bar is visible).
 */
class WindowProvider implements IContextCollectionProvider {
    public collect(context: IContextCollectionProviderContext): void {
        const window = (context as DomErrorContext).window;
        if (!window) {
            return;
        }

        const col = toCollection('window', {
            location: window.location.href,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio,
            fullScreen: (<any>window).fullScreen,
            name: window.name,
            outerHeight: window.outerHeight,
            outerWidth: window.outerWidth,
            screenX: window.screenX,
            screenY: window.screenY,
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            statusbar: window.statusbar,
            toolbar: window.toolbar,
            top: window.top,
        });
        context.contextCollections.push(col);
    }
}
