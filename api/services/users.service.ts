import {AbstractController} from '../controllers/abstract.controller';
import {CRUD} from "../../common/interfaces/crud.interface";
import {UserDto} from "../dto/user.dto";
import User from '../models/User.model';

class UsersService implements CRUD {
    userDto = new AbstractController(User);

    async create(resource: UserDto) {
        return this.userDto.addData(resource);
    }

    async deleteById(resourceId: string) {
        return this.userDto.removeDataById(resourceId);
    };

    async list(limit: number, page: number) {
        return this.userDto.getData(limit, page);
    };

    async getUserByEmail(email: string){
        return this.userDto.getDataByEmail(email);
    }

    async readById(resourceId: string) {
        return this.userDto.getDataById(resourceId);
    };

    async updateById(resource: UserDto) {
        return this.userDto.putDataById(resource);
    };

    async getUsersByConditions(conditions: object, projections: object, populate: object) {
        return this.userDto.getByConditions(conditions, projections, populate);
    }
}

export default new UsersService();