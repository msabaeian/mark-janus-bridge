import express, { Express } from "express";

class ExpressApp {
    private static instance: ExpressApp;
    private app: Express;

    private constructor() {
        this.app = express();
        this.app.set("etag", false);
        this.app.set("x-powered-by", false);
        this.app.use(express.json());
    }

    public static getInstance(): ExpressApp {
        if (!ExpressApp.instance) {
            ExpressApp.instance = new ExpressApp();
        }
        return ExpressApp.instance;
    }

    public static getApp(): Express {
        return ExpressApp.getInstance().app;
    }
}

export default ExpressApp;
