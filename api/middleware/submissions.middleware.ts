import express from 'express';
import submissionService from '../services/submission.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:submission-middleware');
class SubmissionsMiddleware {

    async validateRequiredSubmissionBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body && req.body.hospitalId && req.body.userId && req.body.departmentId && req.body.wardId) {
            next();
        } else {
            res.status(400).send({error: `Missing required fields hospitalId, userId, departmentId, unitId`});
        }
    }

    async validateSubmissionExists(req: express.Request, res: express.Response, next: express.NextFunction) {
        const submission = await submissionService.readById(req.params.submissionId);
        if (submission) {
            next();
        } else {
            res.status(404).send({error: `HCAI Submission ${req.params.submissionId} not found`});
        }
    }

    async extractSubmissionId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.submissionId;
        next();
    }
}

export default new SubmissionsMiddleware();