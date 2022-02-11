import express from 'express';
import hcaiService from '../services/hcai.service';
import hopsitalService from '../services/hospitals.service';
import ICDCodeservice from '../services/icd-codes.service';

import debug from 'debug';

const log: debug.IDebugger = debug('app:hcai-controller');
class HcaiController {

    async listHcai(req: express.Request, res: express.Response) {
        const hcais = await hcaiService.list(100, 0);
        if (req.params.hospital_id) {
            const hospital = await hopsitalService.readById(req.params.hospital_id, { 'name': 1, 'departments': 1});
            const departments = hospital.departments;
            let units: any[] = [];
            departments.forEach((eachDepartment: any) => {
                if (eachDepartment && eachDepartment.units && eachDepartment.units.length > 0) {
                    eachDepartment.units.forEach((eachUnit: any) => {
                        eachUnit['departmentId'] = eachDepartment._id;
                        units.push(eachUnit);
                    });
                   delete eachDepartment.units;
                }
            });
            delete hospital.departments;
            for (const each of hcais) {
                if (each && each.steps && each.steps.length > 0) {
                    for (const step of each.steps) {
                        if (step.fields && step.fields.length > 0) {
                            for (const field of step.fields) {
                                if (field.key === 'hospitalId')
                                {
                                    field.description = hospital.name;
                                    field.selected = hospital;
                                }
                                if (field.key === 'departmentId')
                                {
                                    field.options = departments;
                                }
                                if (field.key === 'unitId')
                                {
                                    field.options = units;
                                }
                                if (field.key === 'ICD10Id') {
                                    field.options = await ICDCodeservice.list(100, 0);
                                }
                            }
                        }
                    }
                }
            }
        }
        res.set({
            'X-Total-Count': hcais.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(hcais);
    }

    async listTitles(req: express.Request, res: express.Response) {
        const hcai = await hcaiService.list(100, 0, {'title': 1});
        console.log(hcai, 'hcai');
        res.status(200).send(hcai);
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