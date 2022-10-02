import cloudinary from 'cloudinary';
import { config } from './index';

export const CloudinarySetup = async () => {
  await cloudinary.config({
    cloud_name: config?.cloudinary?.name,
    api_key: config?.cloudinary?.api,
    api_secret: config?.cloudinary?.secret
  });
}