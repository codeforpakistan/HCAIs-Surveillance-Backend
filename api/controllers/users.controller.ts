import express from 'express';
import usersService from '../services/users.service';
import hospitalService from '../services/hospitals.service';
import debug from 'debug';
import { UserDocument } from '../models/User.model';
import { IVerifyOptions } from 'passport-local';
import './../config/passportConfig';
import { body, check, validationResult } from 'express-validator';
import passport from 'passport';
const saltRounds = 10;

const log: debug.IDebugger = debug('app:users-controller');
class UsersController {

    async listUsers(req: express.Request, res: express.Response) {
        const users = await usersService.list(100, 0);
        res.set({
            'X-Total-Count': users.length,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        }).status(200).send(users);
    }

    async getUserById(req: express.Request, res: express.Response) {
        const user = await usersService.readById(req.params.userId);
        res.status(200).send(user);
    }

    async login(req: express.Request, res: express.Response,  next: express.NextFunction) {
        await check('email', 'Email is not valid').isEmail().run(req);
        await check('password', 'Password cannot be blank').isLength({min: 1}).run(req);
        await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).send({ success: false, msg: 'login failed', error: errors }); 
        }
        passport.authenticate('local', (err: Error, user: UserDocument, info: IVerifyOptions) => {
            if (err) { return next(err); }
            if (!user) {
                return res.status(401).send({ success: false, msg: 'login failed', error: info.message }); 
            }
            req.logIn(user, async (err)  => {
                if (err) { return next(err); }
                const hospitals = await hospitalService.getHospitalsByConditions({ '_id': {'$in': user.hospitals } }, { 'name': 1 }, {});
                user.hospitals = hospitals;
                return res.status(200).send({ success: true, msg: 'Success! You are logged in.', user: user }); 
            });
        })(req, res, next);
    }

    async createUser(req: express.Request, res: express.Response) {
        const userId = await usersService.create(req.body);
        res.status(200).send({id: userId});
    }

    async put(req: express.Request, res: express.Response) {
        log(await usersService.updateById({id: req.params.userId, ...req.body}));
        res.status(204).send(``);
    }

    async removeUser(req: express.Request, res: express.Response) {
        log(await usersService.deleteById(req.params.userId));
        res.status(204).send(``);
    }
}

export default new UsersController();