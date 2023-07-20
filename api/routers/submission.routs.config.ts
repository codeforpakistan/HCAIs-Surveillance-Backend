import {CommonRoutesConfig} from '../../common/common.routes.config';
import SubmissionController from '../controllers/submission.controller';
import SubmissionsMiddleware from '../middleware/submissions.middleware';
import express from 'express';

export class SubmissionRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'SubmissionRoutes');
    }

    configureRoutes() {
        this.app.route(`/submissions`)
            .get(SubmissionController.listSubmissions)
            .post(
                SubmissionsMiddleware.validateRequiredSubmissionBodyFields,
                SubmissionController.createSubmission);

        this.app.route('/submissions-by-ids')
            .post(SubmissionController.getSubmissionCount);

        this.app.route('/submissions/count/:hospital_id/:hcai_id')
            .get(SubmissionController.getSubmissionCount);
        
        this.app.route(`/populated-submissions`)
            .get(SubmissionController.listPopulatedSubmissions);

        return this.app;
    }
}