import {CommonRoutesConfig} from '../../common/common.routes.config';
import draftController from '../controllers/draft.controller';
import express from 'express';
export class DraftRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'draftRoutes');
    }

    configureRoutes() {

        this.app.route(`/draft`)
            .get(draftController.listDrafts)
            .post(
                draftController.createDraft);

        this.app.route(`/draft/:id`)
            .get(draftController.getDraftById)
            .delete(draftController.removedraft);

        this.app.route(`/draft-by-userId/:id`)
            .get(draftController.getDraftByUserId)

        this.app.put(`/draft/:id`,[
            draftController.put
        ]);

        return this.app;
    }
}