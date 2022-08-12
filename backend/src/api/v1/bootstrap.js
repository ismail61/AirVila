import express from 'express';
import { startingMiddleware } from './middlewares/starting.middleware';
import { connectToDatabase } from './database/connectToDatabase';
import { config } from '../../config'
import { routes } from './routes'
import Emitter from 'events';
import { Server } from 'socket.io';
import socketImplementation from './socket/socket';

const bootstrap = async () => {

  const app = express();

  startingMiddleware(app);
  await connectToDatabase();

  routes(app);

  // unexpected  router hit shows error
  app.all('*', (req, res, next) => {
    next(
      res.status(404).json({ err: `Can't find ${req.originalUrl} on this server!` })
    );
  })

  const server = app.listen(config.app.port, () => {
    console.log(`Server is running at ${config.app.port}`)
  });

  //Event Emitter
  const eventEmitter = new Emitter();
  app.set('eventEmitter', eventEmitter);

  //Socket IO
  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  })

  socketImplementation(eventEmitter, io);

  process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
  });

  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  });

  process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
  });
};

export { bootstrap };

