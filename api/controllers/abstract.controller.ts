import debug from 'debug';
const log: debug.IDebugger = debug('app:in-memory-dao');

export class AbstractController {
    Model: any;

    constructor(Model: any) {
        this.Model = Model;
        log('Created new instance of DataDao');
    }

    async addData(Data: any) {
        const result = await this.Model.create(Data);
        return result;
    }

    async getData() {
        const result = await this.Model.find().lean();
        return result;
    }

    async getDataById(DataId: string) {
        return await this.Model.findById(DataId).lean();
    }

    async getDataByEmail(email: string) {
        return await this.Model.findOne({'email': email}).lean();
    }

    async getDataByContact(contact: string) {
        return await this.Model.findOne({'contact': contact}).lean();
    }

    async putDataById(Data: any) {
        const result = await this.Model.findOneAndUpdate({ 'email': Data.email }, { '$set': Data}, { new: true });
        return result;
    }
    async removeDataById(DataId: string) {
        const result = await this.Model.remove({ '_id': DataId });
        return result;
    }

    async getByConditions(conditions: object, projections: object) {
        const result = await this.Model.find(conditions, projections).lean();
        return result;
    }
}
