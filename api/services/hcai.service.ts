import {AbstractController} from '../controllers/abstract.controller';
import {CRUD} from "../../common/interfaces/crud.interface";
import { HcaiDto } from "../dto/hcai.dto";
import Hcai from '../models/hcai.model';

class HcaiService implements CRUD {
    hcaiDto = new AbstractController(Hcai);

    async create(resource: HcaiDto) {
        return this.hcaiDto.addData(resource);
    }

    async deleteById(resourceId: string) {
        return this.hcaiDto.removeDataById(resourceId);
    };

    async list(limit: number, page: number) {
        return this.hcaiDto.getData();
    };

    async readById(resourceId: string) {
        return this.hcaiDto.getDataById(resourceId);
    };

    async updateById(resource: HcaiDto) {
        return this.hcaiDto.putDataById(resource);
    };

    async getUsersByConditions(conditions: object, projections: object, populate: object) {
        return this.hcaiDto.getByConditions(conditions, projections, populate);
    }
}

export default new HcaiService();