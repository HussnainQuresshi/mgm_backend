import compression from 'compression';
import cookieParser from 'cookie-parser';
import '../RabbitMQ/rabbitmq.js';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import Routes from '../routes.js';

const ExpressConfig = (): Application => {
  const app = express();
  app.use(compression());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use('/api', Routes);
  return app;
};

export default ExpressConfig;
