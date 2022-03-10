import express from 'express';
import antibioticsService from '../services/antibiotics.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:antibiotics-controller');
class AntibioticsController {

    async listAntibiotics(req: express.Request, res: express.Response) {
        const antibiotics = await antibioticsService.list(100, 0);
        res.set({
            'X-Total-Count': antibiotics.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(antibiotics);
    }

    async getAntibioticById(req: express.Request, res: express.Response) {
        const antibiotic = await antibioticsService.readById(req.params.antibioticId);
        res.status(200).send(antibiotic);
    }

    async createAntibiotic(req: express.Request, res: express.Response) {
        const antibioticId = await antibioticsService.create(req.body);
        res.status(201).send({id: antibioticId});
    }

    async put(req: express.Request, res: express.Response) {
        log(await antibioticsService.updateById({id: req.params.antibioticId, ...req.body}));
        res.status(204).send(``);
    }

    async removeAntibiotic(req: express.Request, res: express.Response) {
        log(await antibioticsService.deleteById(req.params.antibioticId));
        res.status(204).send(``);
    }
}

export default new AntibioticsController();