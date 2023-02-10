import mongoose from 'mongoose';
import { config } from '../../../config/index'

export const connectToDatabase = async () => {

  /* // Mongoose Connection Information
  mongoose.connect(`mongodb+srv://${config.mongo_db.username}:${encodeURIComponent(config.mongo_db.password)}@${config.mongo_db.atlas_name}.fzwdv.mongodb.net/${config.mongo_db.db_name}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }) */

  // Mongoose Connection Information
  mongoose.connect(config.mongo_db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })


  mongoose.connection.on('connected', () => {
    console.info('Success! Connected to Database.');
  });

  mongoose.connection.on('disconnected', () => {
    console.error('!!!!!!!!!! Database Disconnected !!!!!!!!!!');
  });

  mongoose.connection.on('reconnected', () => {
    console.warn('!!!!!!!!!! Database Reconnected  !!!!!!!!!!');
  });

  mongoose.connection.on('error', (error) => {
    console.error('Failed! Database connection failed. \n', error);
  });
};

