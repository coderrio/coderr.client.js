import * as m from './main';
import { HttpsUploader } from './uploaders/node-uploader';

export * from './main';

m.setUploaderFactory((url: string, key: string, secret?: string) => {
    if (!secret) {
        throw new Error('The Node.js configuration must have a sharedSecret.');
    }

    return new HttpsUploader(url, key, secret);
});
