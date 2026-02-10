import { app, setupApp } from '../server/index';

export default async function handler(req, res) {
    await setupApp();
    return app(req, res);
}
