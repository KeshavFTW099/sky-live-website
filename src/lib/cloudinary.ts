import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn(
    '[Cloudinary Config] Warning: Cloudinary environment variables are missing. File uploads and media listing will fail until CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.'
  );
}

cloudinary.config({
  cloud_name: cloudName || 'mock-cloud',
  api_key: apiKey || 'mock-key',
  api_secret: apiSecret || 'mock-secret',
  secure: true,
});

export default cloudinary;
