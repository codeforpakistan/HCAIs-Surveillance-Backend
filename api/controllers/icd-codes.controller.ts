import express from 'express';
import ICDCodeService from '../services/icd-codes.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:icd-codes');
class ICDCodeController {

    async listICDCodes(req: express.Request, res: express.Response) {
        const result = await ICDCodeService.list(100, 0);
        res.set({
            'X-Total-Count': result.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(result);
    }

    async getICDCodeById(req: express.Request, res: express.Response) {
        const hcai = await ICDCodeService.readById(req.params.userId);
        res.status(200).send(hcai);
    }

    async createICDCode(req: express.Request, res: express.Response) {
        const hcai = await ICDCodeService.create(req.body);
        res.status(201).send({id: hcai});
    }

    async put(req: express.Request, res: express.Response) {
        log(await ICDCodeService.updateById({id: req.params.id, ...req.body}));
        res.status(204).send(``);
    }

    async removeHcai(req: express.Request, res: express.Response) {
        log(await ICDCodeService.deleteById(req.params.id));
        res.status(204).send(``);
    }
}

export default new ICDCodeController();