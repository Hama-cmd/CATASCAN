import { app, setupApp } from '../server/index.js';

let appReady = false;

export default async function handler(req: any, res: any) {
    if (!appReady) {
        await setupApp();
        appReady = true;
    }
    return app(req, res);
}
