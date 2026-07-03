import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Try importing cloudinary dynamically to avoid crashes if it's not installed/needed
let cloudinary: any = null;
try {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
} catch (e) {
  console.log('Cloudinary package not installed, falling back to local storage.');
}

const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export class UploadService {
  /**
   * Save a base64 image
   * If Cloudinary is configured, upload to Cloudinary.
   * Otherwise, save locally and return the local URL.
   */
  async saveImage(base64Data: string, mimeType: string = 'image/jpeg'): Promise<string> {
    // Clean base64 string
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Image, 'base64');

    // 1. Cloudinary upload if available
    if (cloudinary) {
      try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'lexis_camera_scans' },
            (error: any, result: any) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });
        return uploadResult.secure_url;
      } catch (error) {
        console.error('Cloudinary upload failed, falling back to local:', error);
      }
    }

    // 2. Local Fallback
    const ext = mimeType.split('/')[1] || 'jpg';
    const fileName = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    await fs.promises.writeFile(filePath, buffer);

    const port = process.env.PORT || 3000;
    // We assume backend is running on local URL (or use a host header if available in request)
    // We will return the relative or absolute path. Returning relative /uploads/... makes it easy to prefix.
    // However, returning a fully qualified URL helps the mobile client.
    // We will return `http://<YOUR_BACKEND_IP>:${port}/uploads/${fileName}` or `/uploads/${fileName}`
    // Let's return `/uploads/${fileName}` so the client can prepend the API_BASE_URL.
    // This is much safer and matches axios config on client.
    return `/uploads/${fileName}`;
  }
}
