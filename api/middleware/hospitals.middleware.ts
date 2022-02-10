import express from 'express';
import hospitalService from '../services/hospitals.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:hospitals-controller');
class HospitalsMiddleware {

    async validateRequiredHospitalBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body && req.body.name && req.body.contact, req.body.address, req.body.departments) {
            next();
        } else {
            res.status(400).send({error: `Missing required fields name, contact, address, and departments`});
        }
    }

    async validateSameContactDoesNotExist(req: express.Request, res: express.Response, next: express.NextFunction) {
        const hospital = await hospitalService.getHospitalByContact(req.body.contact);
        if (hospital) {
            res.status(400).send({error: `Hospital already exists`});
        } else {
            next();
        }
    }

    async validateSameContactBelongsToSameHospital(req: express.Request, res: express.Response, next: express.NextFunction) {
        const hospital = await hospitalService.getHospitalByContact(req.body.contact);
        if (hospital && hospital.id === req.params.hospitalId) {
            next();
        } else {
            res.status(400).send({error: `Invalid contact`});
        }
    }

    // Here we need to use an arrow function to bind `this` correctly
    validatePatchContact = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.body.contact) {
            log('Validating contact', req.body.contact);
            
            this.validateSameContactBelongsToSameHospital(req, res, next);
        } else {
            next();
        }
    }

    async validateHospitalExists(req: express.Request, res: express.Response, next: express.NextFunction) {
        const hospital = await hospitalService.readById(req.params.hospitalId);
        if (hospital) {
            next();
        } else {
            res.status(404).send({error: `Hospital ${req.params.hospitalId} not found`});
        }
    }

    async extractHospitalId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.hospitalId;
        next();
    }
}

export default new HospitalsMiddleware();