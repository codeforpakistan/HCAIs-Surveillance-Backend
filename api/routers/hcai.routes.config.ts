import {CommonRoutesConfig} from '../../common/common.routes.config';
import HcaiController from '../controllers/hcai.controller';
import express from 'express';

export class HcaiRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'HcaiRoutes');
    }

    configureRoutes() {
        this.app.route(`/hcai/:hospital_id`)
            .get(HcaiController.listHcai)

        this.app.route(`/get-hcai-titles`)
            .get(HcaiController.listTitles)

        this.app.route(`/hcai`)
            .get(HcaiController.listHcai)
            .post(HcaiController.createHcai);

        return this.app;
    }
}