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
        const results = await this.Model.find().lean();
        results.forEach((result: any) => {
            result.id = result._id;
        });
        return results;
    }

    async getDataById(DataId: string, projections: object = {}) {
        return await this.Model.findById(DataId, projections).lean();
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

    async getByConditions(conditions: object, projections: object, populate: object) {
        const result = await this.Model.find(conditions, projections).populate(populate).lean();
        return result;
    }
}
