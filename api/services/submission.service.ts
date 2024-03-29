import {AbstractController} from '../controllers/abstract.controller';
import {CRUD} from "../../common/interfaces/crud.interface";
import { SubmissionDto } from "../dto/submission.dto";
import Submission from '../models/Submission.model';

class SubmissionService implements CRUD {
    submissionCtrl = new AbstractController(Submission);

    async create(resource: SubmissionDto) {
        return this.submissionCtrl.addData(resource);
    }

    async deleteById(resourceId: string) {
        return this.submissionCtrl.removeDataById(resourceId);
    };

    async list(limit: number, page: number) {
        return this.submissionCtrl.getData(limit, page);
    };

    async listPopulatedSubmissions(limit: number, page: number) {
        return this.submissionCtrl.getByConditions({}, {}, { path: 'hospitalId userId ICD10Id'});
    };

    async readById(resourceId: string) {
        return this.submissionCtrl.getDataById(resourceId);
    };

    async updateById(resource: SubmissionDto) {
        return this.submissionCtrl.putDataById(resource);
    };

    async getSubmissionCount(hcaiId: string, hospitalId: string, userId: string, hospitalIds: any = [], values: any = false) {
        try {
            let query: any = { isSubmitted: true  };
            if (hcaiId) {
                query.hcaiId = hcaiId;
            }
            if (hospitalId) {
                query.hospitalId = hospitalId;
            }
            if (hospitalIds.length > 0) {
                query.hospitalId = { '$in': hospitalIds }
            }
            if (userId) {
                query.userId = userId;
            }
            const results = values ? await Submission.find(query).sort({'_id': -1}).lean() : await Submission.count(query).lean();
            return results;
        } catch (err) {
            console.error(err, 'error in getData');
            return err;
        }
    }

}

export default new SubmissionService();