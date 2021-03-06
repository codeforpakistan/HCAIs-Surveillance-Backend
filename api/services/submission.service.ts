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

}

export default new SubmissionService();