import express from 'express';
import hcaiService from '../services/hcai.service';
import hospitalService from '../services/hospitals.service';
import ICDCodeService from '../services/icd-codes.service';
import antibioticsService from '../services/antibiotics.service';
import organismsService from '../services/organisms.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:hcai-controller');
class HcaiController {

    async listHcai(req: express.Request, res: express.Response) {
        try {
            const result = await hcaiService.readById(req.params.hcai_id);
            if (req.params.hospital_id) {
                const hospital = await hospitalService.readById(req.params.hospital_id, { 'name': 1, 'departments': 1});
                const departments = hospital.departments;
                let wards: any[] = [];
                departments.forEach((eachDepartment: any) => {
                    if (eachDepartment && eachDepartment.wards && eachDepartment.wards.length > 0) {
                        eachDepartment.wards.forEach((eachUnit: any) => {
                            eachUnit['departmentId'] = eachDepartment._id;
                            wards.push(eachUnit);
                        });
                        delete eachDepartment.wards;
                    }
                    delete eachDepartment.wards;
                });
                delete hospital.departments;
                if (result && result.steps && result.steps.length > 0) {
                    for (const step of result.steps) {
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
                                if (field.key === 'wardId')
                                {
                                    field.options = wards;
                                }
                                if (field.key === 'ICD10Id') {
                                    field.options = await ICDCodeService.list(10, 0);
                                }
                                if (
                                    field.key === 'antibioticUsedForProphylaxis' || 
                                    field.key === 'sensitiveTo' || 
                                    field.key === 'resistantTo' || 
                                    field.key === 'intermediate' ||
                                    field.key === 'secondaryPathogenSensitiveTo' || 
                                    field.key === 'secondaryPathogenResistantTo' || 
                                    field.key === 'secondaryPathogenIntermediate'
                                    ) {
                                    field.options = await antibioticsService.list(10, 0);
                                }
                                if (
                                    field.key === 'pathogenIdentified' || 
                                    field.key === 'secondaryPathogenIdentified'
                                    ) {
                                    field.options = await organismsService.list(10, 0);
                                }
                            }
                        }
                    }
                }
            }
            res.set({
                'X-Total-Count': result?.length,
                'Access-Control-Expose-Headers': 'X-Total-Count'
            }).status(200).send([result]);
        } catch(err) {
            res.status(500).send({err: err});
        }
    }

    async listTitles(req: express.Request, res: express.Response) {
        const hcai = await hcaiService.list(100, 0, {'title': 1});
        res.set({
            'X-Total-Count': hcai.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(hcai);
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