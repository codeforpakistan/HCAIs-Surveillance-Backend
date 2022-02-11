import {AbstractController} from '../controllers/abstract.controller';
import {CRUD} from "../../common/interfaces/crud.interface";
import {HospitalDto} from "../dto/hospital.dto";
import Hospital from '../models/Hospital.model';

class HospitalsService implements CRUD {
    hospitalDto = new AbstractController(Hospital);

    async list(limit: number, page: number) {
        return this.hospitalDto.getData();
    };
    
    async create(resource: HospitalDto) {
        return this.hospitalDto.addData(resource);
    }

    async readById(resourceId: string, projections: object = {}) {
        return this.hospitalDto.getDataById(resourceId, projections);
    };

    async getHospitalByContact(contact: string){
        return this.hospitalDto.getDataByContact(contact);
    }

    async updateById(resource: HospitalDto) {
        return this.hospitalDto.putDataById(resource);
    };

    async getHospitalsByConditions(conditions: object, projections: object, populate: object) {
        return this.hospitalDto.getByConditions(conditions, projections, populate);
    }

    async deleteById(resourceId: string) {
        return this.hospitalDto.removeDataById(resourceId);
    };
}

export default new HospitalsService();