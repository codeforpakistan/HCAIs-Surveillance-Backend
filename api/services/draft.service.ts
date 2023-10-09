import {AbstractController} from '../controllers/abstract.controller';
import {CRUD} from "../../common/interfaces/crud.interface";
import Draft from '../models/Draft.model';

class draftService implements CRUD {
    draftDto = new AbstractController(Draft);

    async create(resource: any) {
        return this.draftDto.addData(resource);
    }

    async deleteById(resourceId: string) {
        return this.draftDto.removeDataById(resourceId);
    };

    async list(limit: number, page: number, projections: object = {}) {
        return this.draftDto.getData(limit, page, projections);
    };

    async readById(resourceId: string, projections: object = {}) {
        return this.draftDto.getDataById(resourceId, projections);
    };

    async updateById(resource: any) {
        return await this.draftDto.putDataById(resource);
    };

    async getUsersByConditions(conditions: object, projections: object, populate: object) {
        return this.draftDto.getByConditions(conditions, projections, populate);
    };

}

export default new draftService();