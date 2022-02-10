import {CommonRoutesConfig} from '../../common/common.routes.config';
import ICDCodesController from '../controllers/icd-codes.controller';
import express from 'express';

export class ICDRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ICDRoutes');
    }

    configureRoutes() {
        this.app.route(`/icd-codes`)
            .get(ICDCodesController.listICDCodes)
            .post(ICDCodesController.createICDCode);

        return this.app;
    }
}