import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import express, { Router, json } from 'express';
import routes from 'routes';
import { swaggerServe, swaggerSetup } from 'middlewares/doc.middleware';

export function setupServer() {
  const server = express();
  const router = Router();

  if (process.env.ENV !== 'test') {
    router.use(morgan('dev'));
  }

  router.use(json());
  router.use(cors());
  router.use(compression());

  server.use(router);

  server.use('/api', routes);

  if (process.env.ENV === 'development') {
    server.use('/doc', swaggerServe, swaggerSetup);
  }

  return server;
}
