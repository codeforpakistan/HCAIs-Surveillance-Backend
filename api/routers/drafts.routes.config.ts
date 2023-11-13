import {CommonRoutesConfig} from '../../common/common.routes.config';
import draftController from '../controllers/draft.controller';
import express from 'express';
import { isAuthenticated } from './../config/passportConfig';

export class DraftRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'draftRoutes');
    }

    configureRoutes() {

        this.app.route(`/draft`)
            .get(isAuthenticated, draftController.listDrafts)
            .post(isAuthenticated, 
                draftController.createDraft);

        this.app.route(`/draft/:id`)
            .get(isAuthenticated, draftController.getDraftById)
            .delete(isAuthenticated, draftController.removedraft);

        this.app.put(`/draft/:id`,[
            draftController.put
        ]);

        return this.app;
    }
}