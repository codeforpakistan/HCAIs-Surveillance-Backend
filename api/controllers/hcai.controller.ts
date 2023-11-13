import express from 'express';
import hcaiService from '../services/hcai.service';
import hospitalService from '../services/hospitals.service';
import ICDCodeService from '../services/icd-codes.service';
import antibioticsService from '../services/antibiotics.service';
import UsersService from '../services/users.service';
import organismsService from '../services/organisms.service';
import debug from 'debug';
import { LocalStorage } from "node-localstorage";
global.localStorage = new LocalStorage('./scratch', Number.MAX_VALUE);
const log: debug.IDebugger = debug('app:hcai-controller');
class HcaiController {
    antibiotics: any[] = [];
    icdCodes: any[] = [];
    users: any[] = [];
    organisms: any[] = [];
    
    constructor() {
        this.antibiotics = [];
        this.icdCodes = [];
        this.users = [];
        this.organisms = [];
        this.fetchData();
    }

    fetchData() {
        setTimeout(async () => {
            console.info('fetching ....');
            ICDCodeService.list(-1, 0).then((data) => {
                this.icdCodes = data;
            });
            this.antibiotics = await antibioticsService.list(-1, 0);
            this.antibiotics = this.antibiotics.sort((a, b) => (a['title'] || "").toString().localeCompare((b['title'] || "").toString()));
            this.users = await UsersService.getUsersByConditions({
                'roles': 'Doctor',  'name': { '$exists': true }
            }, { 'name': 1, 'hospitals': 1 }, {});
            this.organisms = await organismsService.list(-1, 0);
            this.organisms = this.organisms.sort((a, b) => (a['title'] || "").toString().localeCompare((b['title'] || "").toString()));
        }, 10);
    }

    async fetchAllAddressDAta() {
        let allAddressData: any = localStorage.getItem('allAddressData');
        if (!allAddressData) {
            allAddressData = await hcaiService.getAllAddresses();
            localStorage.setItem('allAddressData', JSON.stringify(allAddressData));
        } else {
            allAddressData = JSON.parse(allAddressData);
        }
        return allAddressData;
    }

    getAllTehsilData(data: any) {
        let allTehsils:any = [];
        data?.forEach(((eachProvice: any) => {
            eachProvice?.districts?.forEach((eachDistrict: any) => {
                eachDistrict?.tehsils[0]?.forEach((eachTeh: any) => {
                    allTehsils.push({
                        '_id': eachTeh.code,
                        'name': eachTeh.title + '-' + eachTeh.code
                    })
                });
            });
        }));
        return allTehsils;
    }


    getOperationTheatreName(hospitalName: string) {
        if (hospitalName === 'Pakistan Institute of Medical Sciences (PIMS)') {
            return [
                {
                    'name': 'Islamabad Hospital',
                },
                {
                    'name': 'Cardiac Centre',
                },
                {
                    'name': 'Children Hospital'
                },
                {
                    'name': 'MCH'
                },
                {
                    'name': 'Burn Center'
                }
            ];
        } else {
            return [{
                'name': 'Old OT'
            }, {
                'name': 'New OT'
            }];
        }
    }

    getCompleteAddress = async (req: express.Request, res: express.Response) => {
        try {
            if (!req.body.patientTehsil) {
                return res.status(500).send({ success: false });
            }
            let objToReturn: any = {
                province: {},
                district: {},
                tehsil: {   
                    title: '',
                    code: Number
                }
            };
            const addressData = await this.fetchAllAddressDAta();
            addressData?.forEach(((eachProvince: any) => {
                eachProvince?.districts?.forEach((eachDistrict: any) => {
                    if (!objToReturn.tehsil.title) {
                        eachDistrict?.tehsils[0]?.forEach((eachTeh: any) => {
                            if (eachTeh.title + '-' + eachTeh.code === req.body.patientTehsil) {
                                objToReturn.province = eachProvince;
                                objToReturn.district = eachDistrict;
                                objToReturn.tehsil = eachTeh;
                            }
                        });
                    }
                });
            }));
            delete objToReturn.province['districts'];
            delete objToReturn.district['tehsils'];
            res.status(200).send(objToReturn);
        } catch(err) {
            console.error(err, 'err while listHcaiRate');
            res.status(500).send({err: err});
        }
    }

    // hcai rate
    listHcaiRate = async (req: express.Request, res: express.Response)  => {
        try {
            const result = await hcaiService.listHcaiRate(100, 0);
            res.status(200).send(result);
        } catch(err) {
            console.error(err, 'err while listHcaiRate');
            res.status(500).send({err: err});
        }
    }

    async createHcaiRate(req: express.Request, res: express.Response) {
        const hcai = await hcaiService.createHcaiRate(req.body);
        res.status(201).send({id: hcai});
    }
    
    listHcai = async (req: express.Request, res: express.Response)  => {
        try {
            const key = 'ssiForm'+req.params.hospital_id.toString()+req.params.hcai_id.toString();
            let records = null
            if (!records) {
               console.info('Refetching SSI')
               records = await this.getRecordByHospitalId(req.params.hospital_id, req.params.hcai_id)
               localStorage.setItem(key, JSON.stringify(records))
            } else {
                records = JSON.parse(records);
                console.info('sending SSI from cache')
            }
            res.set({
                'X-Total-Count': 1,
                'Access-Control-Expose-Headers': 'X-Total-Count'
            }).status(200).send([records]);
        } catch(err) {
            console.error(err, 'err while fetching');
            res.status(500).send({err: err});
        }
    }

    async getRecordByHospitalId(hospital_id: string, hcai_id: string) {
        try {
            const antibioticsKeys = ['antibioticUsedForProphylaxis', 'sensitiveTo', 'resistantTo', 'sensitiveTo', 'intermediate',
                'antibioticUsedForProphylaxis1', 'sensitiveTo1', 'resistantTo1', 'sensitiveTo1', 'intermediate1',
                'antibioticUsedForProphylaxis2', 'sensitiveTo2', 'resistantTo2', 'sensitiveTo2',  'intermediate2',
                'secondaryPathogenSensitiveTo', 'secondaryPathogenIntermediate', 'secondaryPathogenResistantTo', 'postOPAntibiotic'
            ];
            const result = await hcaiService.readById(hcai_id, { '_id': 0 });
            const addressData = await this.fetchAllAddressDAta();
            const allTehsilData = this.getAllTehsilData(addressData);
            if (hospital_id) {
                const hospital = await hospitalService.readById(hospital_id, { 'name': 1, 'departments': 1});
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
                    delete eachDepartment.units;
                });
                delete hospital.departments;
                if (result && result.steps && result.steps.length > 0) {
                    for (const step of result.steps) {
                        if (step.fields && step.fields.length > 0) {
                            for (const field of step.fields) {
                                if (field.key === 'surgeon') {
                                    field.options = this.users.filter((each: any) => each?.hospitals?.findIndex((eachHospital: any) => eachHospital?.toString() === hospital_id) > -1);
                                }
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
                                    field.options = units
                                }
                                 if (field.key === 'patientTehsil')
                                {
                                    field.options = allTehsilData
                                }
                                if (field.key === 'ICD10Id') {
                                    field.options = this.icdCodes;
                                }
                                if (antibioticsKeys.indexOf(field.key) > -1) {
                                    field.options = this.antibiotics;
                                }
                                if (field.key === 'operationTheatreName') {
                                    field.options = this.getOperationTheatreName(hospital.name);
                                }
                                if (
                                    field.key === 'pathogenIdentified' ||
                                    field.key === 'secondaryPathogenIdentified' ||
                                    field.key === 'pathogenIdentified1' ||
                                    field.key === 'pathogenIdentified2' ||
                                    field.key === 'previousHistoryOfBacterialColonizationOrganism'

                                ) {
                                    field.options = this.organisms;
                                }
                            }
                        }
                    }
                }
            }
            return result;
        } catch(err) {
            console.error(err, 'err while fetching');
            throw err;
        }
    }

    async listTitles(req: express.Request, res: express.Response) {
        const hcai = await hcaiService.list(-1, 0, {'title': 1, 'category': 1, 'submissionEndPoint': 1, 'requiredFields': 1 });
        res.set({
            'X-Total-Count': hcai.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(hcai);
    }

    async listTitlesByRole(req: express.Request, res: express.Response) {
        const hcai = await hcaiService.readByRole(req.body.roles, { 'title': 1, 'category': 1, 'submissionEndPoint': 1, 'requiredFields': 1 });
        res.status(200).send(hcai);
    }

    async getHcaiById(req: express.Request, res: express.Response) {
        const hcai = await hcaiService.readById(req.params.userId);
        res.status(200).send(hcai);
    }

    async createHcai(req: express.Request, res: express.Response) {
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