import {AbstractController} from '../controllers/abstract.controller';
import {CRUD} from "../../common/interfaces/crud.interface";
import { AntibioticDto } from '../dto/antibiotics.dto';
import Antibiotics from '../models/Antibiotic.model';

class AntibioticsService implements CRUD {
    AntibioticModel = new AbstractController(Antibiotics);

    async create(resource: AntibioticDto) {
        return this.AntibioticModel.addData(resource);
    }

    async deleteById(resourceId: string) {
        return this.AntibioticModel.removeDataById(resourceId);
    };

    async list(limit: number, page: number) {
        return this.AntibioticModel.getData(limit, page);
    };

    async readById(resourceId: string) {
        return this.AntibioticModel.getDataById(resourceId);
    };

    async updateById(resource: AntibioticDto) {
        return this.AntibioticModel.putDataById(resource);
    };

    async getUsersByConditions(conditions: object, projections: object, populate: object) {
        return this.AntibioticModel.getByConditions(conditions, projections, populate);
    }
}

export default new AntibioticsService();