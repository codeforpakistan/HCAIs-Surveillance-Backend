import {CommonRoutesConfig} from '../../common/common.routes.config';
import HospitalsController from '../controllers/hospitals.controller';
import HospitalsMiddleware from '../middleware/hospitals.middleware';
import express from 'express';

export class HospitalsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'HospitalsRoutes');
    }

    configureRoutes() {
        this.app.route(`/hospitals`)
            .get(HospitalsController.listHospitals)
            .post(
                HospitalsMiddleware.validateRequiredHospitalBodyFields,
                HospitalsMiddleware.validateSameContactDoesNotExist,
                HospitalsController.createHospital);

        this.app.param(`hospitalId`, HospitalsMiddleware.extractHospitalId);
        this.app.route(`/hospitals/:hospitalId`)
            .all(HospitalsMiddleware.validateHospitalExists)
            .get(HospitalsController.getHospitalById)
            .delete(HospitalsController.removeHospital);

        this.app.put(`/hospitals/:hospitalId`,[
            HospitalsMiddleware.validateRequiredHospitalBodyFields,
            HospitalsMiddleware.validateSameContactBelongsToSameHospital,
            HospitalsController.put
        ]);

        return this.app;
    }
}