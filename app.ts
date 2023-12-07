import MongoStore from 'connect-mongo';
import cors from 'cors';
import debug from 'debug';
import 'dotenv/config';
import express, { RequestHandler } from 'express';
import session from 'express-session';
import * as expressWinston from 'express-winston';
import * as http from 'http';
import mongoose from 'mongoose';
import passport from 'passport';
import * as winston from 'winston';
import { HcaiRoutes } from './api/routers/hcai.routes.config';
import { HospitalsRoutes } from './api/routers/hospitals.routes.config';
import { ICDRoutes } from './api/routers/icd-codes.routes.config';
import { SubmissionRoutes } from './api/routers/submission.routs.config';
import { UsersRoutes } from './api/routers/users.routes.config';
import { CommonRoutesConfig } from './common/common.routes.config';
// API keys and Passport configuration
import { AntibioticRoutes } from './api/routers/antibiotics.routes.config';
import { DraftRoutes } from './api/routers/drafts.routes.config';
import { OrganismRoutes } from './api/routers/organisms.routes.config';
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

app.use(express.json({limit: '10mb'}) as RequestHandler);
app.use(express.urlencoded({limit: '10mb', extended: true}) as  RequestHandler);
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
routes.push(new DraftRoutes(app));

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
