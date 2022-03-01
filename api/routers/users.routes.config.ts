import {CommonRoutesConfig} from '../../common/common.routes.config';
import UsersController from '../controllers/users.controller';
import UsersMiddleware from '../middleware/users.middleware';
import express from 'express';
import { isAuthenticated } from './../config/passportConfig';

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes() {
        this.app.route(`/login`)
            .post(
                 UsersController.login);


        this.app.route(`/users`)
            .get(isAuthenticated, UsersController.listUsers)
            .post(isAuthenticated, 
                UsersMiddleware.validateRequiredUserBodyFields,
                UsersMiddleware.validateSameEmailDoesntExist,
                UsersController.createUser);

        this.app.param(`userId`, UsersMiddleware.extractUserId);
        this.app.route(`/users/:userId`)
            .all(isAuthenticated, UsersMiddleware.validateUserExists)
            .get(isAuthenticated, UsersController.getUserById)
            .delete(isAuthenticated, UsersController.removeUser);

        this.app.put(`/users/:userId`,[
            isAuthenticated,
            UsersMiddleware.validateRequiredUserBodyFields,
            UsersMiddleware.validateSameEmailBelongToSameUser,
            UsersController.put
        ]);

        return this.app;
    }
}