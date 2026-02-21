import { v2 as cloudinary } from 'cloudinary';

// Check if Cloudinary is configured
const isConfigured = 
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
  process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadToCloudinary(
  file: File | Buffer,
  folder: string = 'dropfit'
): Promise<string> {
  // Check if Cloudinary is configured
  if (!isConfigured) {
    throw new Error(
      'Cloudinary is not configured. Please add CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to your .env.local file. See CLOUDINARY_SETUP.md for details.'
    );
  }

  try {
    let uploadData: string;

    if (file instanceof File) {
      // Convert File to base64
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      uploadData = `data:${file.type};base64,${buffer.toString('base64')}`;
    } else {
      // Buffer
      uploadData = `data:image/jpeg;base64,${file.toString('base64')}`;
    }

    const result = await cloudinary.uploader.upload(uploadData, {
      folder,
      resource_type: 'auto',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
}

export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
  }
): string {
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  if (!options) {
    return `${baseUrl}/${publicId}`;
  }

  const transformations: string[] = [];
  
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  
  const transformString = transformations.join(',');
  return `${baseUrl}/${transformString}/${publicId}`;
}

export default cloudinary;
