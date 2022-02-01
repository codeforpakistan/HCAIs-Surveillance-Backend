import express from 'express';
import hcaiService from '../services/hcai.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:hcai-controller');
class HcaiController {

    async listHcai(req: express.Request, res: express.Response) {
        const hcais = await hcaiService.list(100, 0);
        hcais.forEach((hcai: any) => {
            hcai.id = hcai._id;
        });
        res.set({
            'X-Total-Count': hcais.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(hcais);
    }

    async getHcaiById(req: express.Request, res: express.Response) {
        const hcai = await hcaiService.readById(req.params.userId);
        res.status(200).send(hcai);
    }

    async createHcai(req: express.Request, res: express.Response) {
        console.info('here')
        const hcai = await hcaiService.create(req.body);
        res.status(201).send({id: hcai});
    }

    async put(req: express.Request, res: express.Response) {
        log(await hcaiService.updateById({id: req.params.id, ...req.body}));
        res.status(204).send(``);
    }

    async removeHcai(req: express.Request, res: express.Response) {
        log(await hcaiService.deleteById(req.params.id));
        res.status(204).send(``);
    }
}

export default new HcaiController();