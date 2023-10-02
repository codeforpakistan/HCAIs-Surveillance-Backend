import debug from 'debug';
const log: debug.IDebugger = debug('app:in-memory-dao');

export class AbstractController {
    Model: any;

    constructor(Model: any) {
        this.Model = Model;
        log('Created new instance of DataDao');
    }

    async addData(Data: any) {
        try {
            const result = await this.Model.create(Data);
            return result;
        } catch (err) {
            console.error(err, 'error on add Data');
            return err;
        }
    }

    async getData(list = -1, page = -1, projections: object = {}, sortKey: String = '_id', sortOrder: number = -1) {
        try {
            let results = [];
            if (list > -1) {
                results = await this.Model.find({}, projections).sort({ sortKey: sortOrder }).limit(list).lean();
            } else {
                results = await this.Model.find({}, projections).lean();
            }
            results.forEach((result: any) => {
                result.id = result._id;
            });
            return results;
        } catch (err) {
            console.error(err, 'error in getData');
            return err;
        }
    }

    async getDataById(DataId: string, projections: object = {}) {
        try {
            return await this.Model.findById(DataId, projections).lean();
        } catch (err) {
            console.error(err, 'error in getDataById');
            return err;
        }
    }

    async getDataByEmail(email: string) {
        try {
            return await this.Model.findOne({ 'email': email }).lean();
        } catch (err) {
            console.error(err, 'error in getDataByEmail');
            return err;
        }
    }

    async getDataByContact(contact: string) {
        try {
            return await this.Model.findOne({ 'contact': contact }).lean();
        } catch (err) {
            console.error(err, 'error in getDataByContact');
            return err;
        }
    }

    async putDataById(Data: any) {
        try {
            const query = Data.email ? { 'email': Data.email } : { '_id': Data._id };
            const result = await this.Model.findOneAndUpdate(query, { '$set': Data }, { new: true });
            return result;
        } catch (err) {
            console.error(err, 'error in putDataById');
            return err;
        }
    }

    async removeDataById(DataId: string) {
        try {
            const result = await this.Model.remove({ '_id': DataId });
            return result;
        } catch (err) {
            console.error(err, 'error in putDataById');
            return err;
        }
    }

    async getByConditions(conditions: object, projections: object, populate: any) {
        try {
            let result = [];
            if (populate.path) {
                result = await this.Model.find(conditions, projections).populate(populate).lean();
            } else {
                result = await this.Model.find(conditions, projections).lean();
            }
            result.forEach((each: any) => {
                each.id = each._id;
            });
            return result;
        } catch (err) {
            console.error(err, 'error in getByConditions');
            return err;
        }
    }
}
