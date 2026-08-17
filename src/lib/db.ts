import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import dns from 'dns';
import User from '@/models/User';
import Content from '@/models/Content';

// Force Node.js to prefer IPv4 lookup to resolve Windows SRV resolution bugs
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}



/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function seedDatabase() {
  try {
    // 1. Seed/Update Admin User
    const username = process.env.ADMIN_USERNAME || 'sky_admin';
    const password = process.env.ADMIN_PASSWORD || '9908140066@sky';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Delete the old default 'admin' user if we are using a different username
    if (username !== 'admin') {
      const deleteResult = await User.deleteOne({ username: 'admin' });
      if (deleteResult.deletedCount > 0) {
        console.log('[DB Seed] Successfully deleted old default "admin" user.');
      }
    }

    const adminUser = await User.findOne({ username });
    if (!adminUser) {
      await User.create({
        username,
        password: hashedPassword,
      });
      console.log(`[DB Seed] Created default admin user: ${username}`);
    } else {
      // Update the password in case it was changed in environment configuration
      adminUser.password = hashedPassword;
      await adminUser.save();
      console.log(`[DB Seed] Updated admin user password for: ${username}`);
    }

    // 2. Seed CMS Content ONLY if the collection is empty
    // IMPORTANT: Never wipe existing content — admin edits must be preserved
    const contentCount = await Content.countDocuments();
    if (contentCount === 0) {
      // In production (Vercel), content.json lives in the public/ directory.
      // In development, it may also exist at the project root as a fallback.
      const publicPath = path.join(process.cwd(), 'public', 'content.json');
      const rootPath = path.join(process.cwd(), 'content.json');

      let filePath = '';
      if (fs.existsSync(publicPath)) {
        filePath = publicPath;
      } else if (fs.existsSync(rootPath)) {
        filePath = rootPath;
      }

      if (filePath) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const parsedContent = JSON.parse(fileContent);
        await Content.create(parsedContent);
        console.log(`[DB Seed] Successfully seeded default CMS content from ${path.basename(filePath)}`);
      } else {
        console.warn('[DB Seed] Warning: content.json not found. Skipping content seed.');
      }
    } else {
      // Ensure company name is always clean in existing database documents (removes LLP, fixes spelling/spacing)
      const existingContent = await Content.findOne({});
      if (existingContent) {
        const serialized = JSON.stringify(existingContent);
        if (serialized.includes('LLP') || serialized.includes('Lifesciences')) {
          console.log('[DB Seed] Stale company name format detected in DB. Running sanitization...');
          
          // Helper to recursively clean text fields
          const cleanObj = (obj: any): any => {
            if (obj === null || obj === undefined) return obj;
            if (typeof obj === 'string') {
              let cleaned = obj.replace(/Sky\s+Life\s*sciences\s+Solutions\s+LLP/gi, 'Sky Life Sciences Solutions');
              cleaned = cleaned.replace(/Sky\s+Lifesciences\s+Solutions\s+LLP/gi, 'Sky Life Sciences Solutions');
              cleaned = cleaned.replace(/\bSky\s+Lifesciences\s+Solutions\b/gi, 'Sky Life Sciences Solutions');
              cleaned = cleaned.replace(/\bSky\s+Life\s+Sciences\s+Solutions\b/gi, 'Sky Life Sciences Solutions');
              return cleaned;
            }
            if (Array.isArray(obj)) {
              return obj.map(item => cleanObj(item));
            }
            if (typeof obj === 'object') {
              if (obj.constructor && (obj.constructor.name === 'ObjectId' || obj.constructor.name === 'Date')) {
                return obj;
              }
              const newObj: any = {};
              for (const key of Object.keys(obj)) {
                newObj[key] = cleanObj(obj[key]);
              }
              return newObj;
            }
            return obj;
          };

          const cleanedData = cleanObj(existingContent.toObject());
          delete cleanedData._id;
          delete cleanedData.__v;
          delete cleanedData.createdAt;
          delete cleanedData.updatedAt;

          await Content.replaceOne({ _id: existingContent._id }, cleanedData);
          console.log('[DB Seed] Database content sanitized successfully.');
        }
      }
    }
  } catch (error) {
    console.error('[DB Seed] Seeding error:', error);
  }
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (m) => {
      console.log('Connected to MongoDB via Mongoose');
      // Trigger database seeding checks in the background
      await seedDatabase();
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function getContent() {
  try {
    await dbConnect();
    const contentDoc = await Content.findOne({});
    if (contentDoc) {
      return JSON.parse(JSON.stringify(contentDoc));
    }
  } catch (error) {
    console.error('[DB] Failed to fetch content from database, falling back to local content.json:', error);
  }

  // Fallback to local content.json
  try {
    const publicPath = path.join(process.cwd(), 'public', 'content.json');
    const rootPath = path.join(process.cwd(), 'content.json');
    let filePath = '';
    if (fs.existsSync(publicPath)) {
      filePath = publicPath;
    } else if (fs.existsSync(rootPath)) {
      filePath = rootPath;
    }

    if (filePath) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    }
  } catch (err) {
    console.error('[DB] Failed to read local content.json fallback:', err);
  }

  return null;
}

export default dbConnect;
