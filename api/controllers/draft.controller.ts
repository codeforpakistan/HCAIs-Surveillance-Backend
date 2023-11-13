import express from 'express';
import DraftsService from '../services/draft.service';
import debug from 'debug';
const saltRounds = 10;

const log: debug.IDebugger = debug('app:drafts-controller');
class draftsController {

    async listDrafts(req: express.Request, res: express.Response) {
        const drafts = await DraftsService.list(100, 0);
        res.set({
            'X-Total-Count': drafts.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(drafts);
    }

    async getDraftById(req: express.Request, res: express.Response) {
        const draft = await DraftsService.readById(req.params.id);
        res.status(200).send(draft);
    }

    async getDraftByUserId(req: express.Request, res: express.Response) {
        const draft = await DraftsService.readByUserId(req.params.id);
        res.status(200).send(draft || []);
    }

    async createDraft(req: express.Request, res: express.Response) {
        const data = await DraftsService.create(req.body);
        res.status(200).send(data);
    }

    async put(req: express.Request, res: express.Response) {
        const data = await DraftsService.updateById({...req.params, ...req.body});
        res.status(200).send(data);
    }

    async removedraft(req: express.Request, res: express.Response) {
        log(await DraftsService.deleteById(req.params.id));
        res.status(200).send({ succss: true });
    }
}

export default new draftsController();