import {CommonRoutesConfig} from '../../common/common.routes.config';
import AntibioticsController from '../controllers/antibiotics.controller';
import express from 'express';

export class AntibioticRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'AntibioticRoutes');
    }

    configureRoutes() {
        this.app.route(`/antibiotics`)
            .get(AntibioticsController.listAntibiotics)
            .post(AntibioticsController.createAntibiotic);

        return this.app;
    }
}