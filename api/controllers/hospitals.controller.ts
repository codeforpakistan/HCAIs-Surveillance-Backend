import express from 'express';
import hospitalsService from '../services/hospitals.service';
import argon2 from 'argon2';
import debug from 'debug';

const log: debug.IDebugger = debug('app:hospitals-controller');
class HospitalsController {

    async listHospitals(req: express.Request, res: express.Response) {
        const hospitals = await hospitalsService.list(100, 0);
        hospitals.forEach((hospital: any) => {
            hospital.id = hospital._id;
        });
        res.set({
            'X-Total-Count': hospitals.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(hospitals);
    }

    async getHospitalById(req: express.Request, res: express.Response) {
        const hospital = await hospitalsService.readById(req.params.hospitalId);
        res.status(200).send(hospital);
    }

    async createHospital(req: express.Request, res: express.Response) {
        const hospitalId = await hospitalsService.create(req.body);
        res.status(201).send({id: hospitalId});
    }

    async put(req: express.Request, res: express.Response) {
        log(await hospitalsService.updateById({id: req.params.hospitalId, ...req.body}));
        res.status(204).send(``);
    }

    async removeHospital(req: express.Request, res: express.Response) {
        log(await hospitalsService.deleteById(req.params.hospitalId));
        res.status(204).send(``);
    }
}

export default new HospitalsController();