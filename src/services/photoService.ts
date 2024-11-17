import { v2 as cloudinary } from 'cloudinary'


export const uploadImage = async (base64:string, folder:string, filename:string) => {
  try {
    const response = await cloudinary.uploader.upload(base64, {
      folder: folder,
      public_id: filename, 
      overwrite: true, 
      access_mode: 'public',
    });
    return response.secure_url; 
  } catch (error) {
    throw error;
  }
};