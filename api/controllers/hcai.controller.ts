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
            const antibioticsKeys = ['antibioticUsedForProphylaxis', 'sensitiveTo', 'resistantTo', 'sensitiveTo', 'intermediate',
                'antibioticUsedForProphylaxis1', 'sensitiveTo1', 'resistantTo1', 'sensitiveTo1', 'intermediate1',
                'antibioticUsedForProphylaxis2', 'sensitiveTo2', 'resistantTo2', 'sensitiveTo2',  'intermediate2',
                'secondaryPathogenSensitiveTo', 'secondaryPathogenIntermediate', 'secondaryPathogenResistantTo',
            ];
            const result = await hcaiService.readById(req.params.hcai_id);
            if (req.params.hospital_id) {
                const hospital = await hospitalService.readById(req.params.hospital_id, { 'name': 1, 'departments': 1});
                const departments = [{
                    "name": "Select Department",
                    "_id": null
                }].concat(hospital.departments);
                let units: any[] = [];
                departments.forEach((eachDepartment: any) => {
                    if (eachDepartment && eachDepartment.units && eachDepartment.units.length > 0) {
                        eachDepartment.units.forEach((eachUnit: any) => {
                            eachUnit['departmentId'] = eachDepartment._id;
                            units.push(eachUnit);
                        });
                        delete eachDepartment.units;
                    }
                    delete eachDepartment.units;
                });
                delete hospital.departments;
                const antibiotics = await antibioticsService.list(1000, 0);
                const organisms = await organismsService.list(1000, 0);
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
                                    field.options = [{
                                        "name": "Select Ward",
                                        "_id": null,
                                        "departmentId": null
                                    }].concat(units);
                                }
                                if (field.key === 'ICD10Id') {
                                    field.options = await ICDCodeService.list(1000, 0);
                                }
                                if (antibioticsKeys.indexOf(field.key) > -1) {
                                    field.options = antibiotics;
                                }
                                if (
                                    field.key === 'pathogenIdentified' ||
                                    field.key === 'secondaryPathogenIdentified' ||
                                    field.key === 'pathogenIdentified1' ||
                                    field.key === 'pathogenIdentified2' ||
                                    field.key === 'previousHistoryOfBacterialColonizationOrganism'

                                ) {
                                    field.options = field.options = [{
                                        "_id": null,
                                        "title": "Select Organism",
                                        "id": null
                                    }].concat(organisms);
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
            console.error(err, 'err while fetching');
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