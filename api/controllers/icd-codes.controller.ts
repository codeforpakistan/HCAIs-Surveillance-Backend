import express from 'express';
import ICDCodeservice from '../services/icd-codes.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:hcai-controller');
class ICDCodeController {

    async listICDCodes(req: express.Request, res: express.Response) {
        const result = await ICDCodeservice.list(100, 0);
        res.set({
            'X-Total-Count': result.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(result);
    }

    async getICDCodeById(req: express.Request, res: express.Response) {
        const hcai = await ICDCodeservice.readById(req.params.userId);
        res.status(200).send(hcai);
    }

    async createICDCode(req: express.Request, res: express.Response) {
        const hcai = await ICDCodeservice.create(req.body);
        res.status(201).send({id: hcai});
    }

    async put(req: express.Request, res: express.Response) {
        log(await ICDCodeservice.updateById({id: req.params.id, ...req.body}));
        res.status(204).send(``);
    }

    async removeHcai(req: express.Request, res: express.Response) {
        log(await ICDCodeservice.deleteById(req.params.id));
        res.status(204).send(``);
    }
}

export default new ICDCodeController();