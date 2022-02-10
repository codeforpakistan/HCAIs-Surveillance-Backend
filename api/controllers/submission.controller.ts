import express from 'express';
import submissionService from '../services/submission.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:hcai-controller');
class SubmissionController {

    async listSubmissions(req: express.Request, res: express.Response) {
        const result = await submissionService.list(100, 0);
        res.set({
            'X-Total-Count': result.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(result);
    }

    async listPopuluatedSubmissions(req: express.Request, res: express.Response) {
        const result = await submissionService.listPopuluatedSubmissions(100, 0);
        res.set({
            'X-Total-Count': result.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(result);
    }

    async getSubmissionById(req: express.Request, res: express.Response) {
        const hcai = await submissionService.readById(req.params.userId);
        res.status(200).send(hcai);
    }

    async createSubmission(req: express.Request, res: express.Response) {
        console.info('here')
        const hcai = await submissionService.create(req.body);
        res.status(201).send({id: hcai});
    }

    async put(req: express.Request, res: express.Response) {
        log(await submissionService.updateById({id: req.params.id, ...req.body}));
        res.status(204).send(``);
    }

    async removeHcai(req: express.Request, res: express.Response) {
        log(await submissionService.deleteById(req.params.id));
        res.status(204).send(``);
    }
}

export default new SubmissionController();