import {AbstractController} from '../controllers/abstract.controller';
import {CRUD} from "../../common/interfaces/crud.interface";
import { OrganismDto } from '../dto/organisms.dto';
import Organisms from '../models/Organism.model';

class OrganismsService implements CRUD {
    OrganismModel = new AbstractController(Organisms);

    async create(resource: OrganismDto) {
        return this.OrganismModel.addData(resource);
    }

    async deleteById(resourceId: string) {
        return this.OrganismModel.removeDataById(resourceId);
    };

    async list(limit: number, page: number) {
        return this.OrganismModel.getData(limit, page);
    };

    async readById(resourceId: string) {
        return this.OrganismModel.getDataById(resourceId);
    };

    async updateById(resource: OrganismDto) {
        return this.OrganismModel.putDataById(resource);
    };

    async getUsersByConditions(conditions: object, projections: object, populate: object) {
        return this.OrganismModel.getByConditions(conditions, projections, populate);
    }
}

export default new OrganismsService();