import compression from 'compression';
import cors from 'cors';
import express, { json, Router } from 'express';
import morgan from 'morgan';

import { swaggerServe, swaggerSetup } from '@/middlewares/doc.middleware';
import routes from '@/routes';

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
