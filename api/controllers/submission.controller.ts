import express from 'express';
import submissionService from '../services/submission.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:hcai-controller');
class SubmissionController {

    async listSubmissions(req: express.Request, res: express.Response) {
        const result = await submissionService.list(100, 0);
        res.set({
            'X-Total-Count': result.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(result);
    }

    async listPopulatedSubmissions(req: express.Request, res: express.Response) {
        const result = await submissionService.listPopulatedSubmissions(100, 0);
        result.forEach((each: any) => {
            if (each.departmentId && each.hospitalId && each.hospitalId.departments && each.hospitalId.departments.length > 0) {
                each.hospitalId.departments = each.hospitalId.departments.find((eachDep: any) => 
                    eachDep && eachDep._id && eachDep._id.toString() === each.departmentId.toString());
                if (each.unitId && each.hospitalId.departments) {
                    each.hospitalId.departments.units = each.hospitalId.departments.units.find((eachUnit: any) => 
                    eachUnit && eachUnit._id && eachUnit._id.toString() === each.unitId.toString());
                }
            }
        });
        res.set({
            'X-Total-Count': result.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(result);
    }

    async getSubmissionById(req: express.Request, res: express.Response) {
        const hcai = await submissionService.readById(req.params.userId);
        res.status(200).send(hcai);
    }

    getSubmissionCount = async (req: express.Request, res: express.Response)  => {
        try {
            const data = Object.keys(req.params).length === 0 ? req.body : req.params;
            const response = await submissionService.getSubmissionCount(data.hcai_id, data.hospital_id, data.userId, data.hospitalIds, data.values);
            res.status(200).send(data.values ? response : { count: response });
        } catch(err) {
            res.status(500).send({ count: null });
        }
    }

    async createSubmission(req: express.Request, res: express.Response) {
        let hcai = {};
        if (req.body._id) {
            hcai = await submissionService.updateById(req.body);
        } else {
            hcai = await submissionService.create(req.body);
        }
        res.status(200).send({id: hcai});
    }

    async put(req: express.Request, res: express.Response) {
        log(await submissionService.updateById({id: req.params.id, ...req.body}));
        res.status(204).send(``);
    }

    async removeHcai(req: express.Request, res: express.Response) {
        log(await submissionService.deleteById(req.params.id));
        res.status(204).send(``);
    }
}

export default new SubmissionController();