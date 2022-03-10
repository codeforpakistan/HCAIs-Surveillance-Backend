import {AbstractController} from '../controllers/abstract.controller';
import {CRUD} from "../../common/interfaces/crud.interface";
import { ICDCodeDto } from "../dto/icd-codes.dto";
import ICDCodes from '../models/ICDCodes.model';

class ICDCodesService implements CRUD {
    ICDCtrl = new AbstractController(ICDCodes);

    async create(resource: ICDCodeDto) {
        return this.ICDCtrl.addData(resource);
    }

    async deleteById(resourceId: string) {
        return this.ICDCtrl.removeDataById(resourceId);
    };

    async list(limit: number, page: number) {
        return this.ICDCtrl.getData(limit, page);
    };

    async readById(resourceId: string) {
        return this.ICDCtrl.getDataById(resourceId);
    };

    async updateById(resource: ICDCodeDto) {
        return this.ICDCtrl.putDataById(resource);
    };

    async getUsersByConditions(conditions: object, projections: object, populate: object) {
        return this.ICDCtrl.getByConditions(conditions, projections, populate);
    }
}

export default new ICDCodesService();