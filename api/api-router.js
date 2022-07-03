import {
    Router
} from 'express';
import V1Router from "./v1/v1-router.js";

const apiRouter = Router();

apiRouter.use('/v1', V1Router);

export default apiRouter;