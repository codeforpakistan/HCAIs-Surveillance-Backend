import {CommonRoutesConfig} from '../../common/common.routes.config';
import SubmissionController from '../controllers/submission.controller';
import express from 'express';

export class SubmissionRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'SubmissionRoutes');
    }

    configureRoutes() {
        this.app.route(`/submissions`)
            .get(SubmissionController.listSubmissions)
            .post(SubmissionController.createSubmission);
        
        this.app.route(`/populated-submissions`)
            .get(SubmissionController.listPopuluatedSubmissions);

        return this.app;
    }
}