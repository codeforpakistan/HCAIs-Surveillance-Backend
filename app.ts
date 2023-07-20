import 'dotenv/config'
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors'
import {CommonRoutesConfig} from './common/common.routes.config';
import { UsersRoutes } from './api/routers/users.routes.config';
import { HospitalsRoutes } from './api/routers/hospitals.routes.config';
import { HcaiRoutes } from './api/routers/hcai.routes.config';
import debug from 'debug';
import mongoose from 'mongoose';
import { SubmissionRoutes } from './api/routers/submission.routs.config';
import { ICDRoutes } from './api/routers/icd-codes.routes.config';
import passport from 'passport';
// API keys and Passport configuration
import { isAuthenticated } from './api/config/passportConfig';
import { OrganismRoutes } from './api/routers/organisms.routes.config';
import { AntibioticRoutes } from './api/routers/antibiotics.routes.config';
const mongoUrl = process.env.DB_URL || 'localhost:27017/hcai';
mongoose.connect(mongoUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected');
});

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb', extended: true}));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.secret || 'SESSION_SECRET4',
    store: new MongoStore({
        mongoUrl
    })
}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

routes.push(new UsersRoutes(app));
// app.use(isAuthenticated);
routes.push(new HospitalsRoutes(app));
routes.push(new HcaiRoutes(app));
routes.push(new SubmissionRoutes(app));
routes.push(new ICDRoutes(app));
routes.push(new OrganismRoutes(app));
routes.push(new AntibioticRoutes(app));



app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`Server running at http://localhost:${port}`)
});

server.listen(port, () => {
    debugLog(`Server running at http://localhost:${port}`);
    console.info(`Server running at http://localhost:${port}`);
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
});
