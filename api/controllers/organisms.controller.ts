import express from 'express';
import organismsService from '../services/organisms.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:organisms-controller');
class OrganismsController {

    async listOrganisms(req: express.Request, res: express.Response) {
        const organisms = await organismsService.list(100, 0);
        res.set({
            'X-Total-Count': organisms.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(organisms);
    }

    async getOrganismById(req: express.Request, res: express.Response) {
        const organism = await organismsService.readById(req.params.organismId);
        res.status(200).send(organism);
    }

    async createOrganism(req: express.Request, res: express.Response) {
        const organismId = await organismsService.create(req.body);
        res.status(201).send({id: organismId});
    }

    async put(req: express.Request, res: express.Response) {
        log(await organismsService.updateById({id: req.params.organismId, ...req.body}));
        res.status(204).send(``);
    }

    async removeOrganism(req: express.Request, res: express.Response) {
        log(await organismsService.deleteById(req.params.organismId));
        res.status(204).send(``);
    }
}

export default new OrganismsController();