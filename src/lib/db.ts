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
    // 1. Seed Admin User if none exists
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'adminpassword123';
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        username,
        password: hashedPassword,
      });
      console.log(`[DB Seed] Created default admin user: ${username}`);
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
