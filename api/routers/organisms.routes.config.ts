import {CommonRoutesConfig} from '../../common/common.routes.config';
import OrganismsController from '../controllers/organisms.controller';
import express from 'express';

export class OrganismRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'OrganismRoutes');
    }

    configureRoutes() {
        this.app.route(`/organisms`)
            .get(OrganismsController.listOrganisms)
            .post(OrganismsController.createOrganism);

        return this.app;
    }
}