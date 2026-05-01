import { Client, Databases, Permission, Role, ID } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load variables from .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!PROJECT_ID || !API_KEY) {
  console.error("❌ Missing required environment variables!");
  console.error("Please add VITE_APPWRITE_PROJECT_ID and APPWRITE_API_KEY to your .env file.");
  process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function setup() {
  let DB_ID = process.env.VITE_DB_ID;
  const COLLECTION_ID = 'students';
  
  try {
    console.log(`🚀 Setting up Appwrite Database (ID: ${DB_ID})...`);
    
    // Skip creating the Database since we already know it exists from the screenshot
    console.log("✅ Using existing database...");

    // 2. Create Collection
    try {
      await databases.createCollection(DB_ID, COLLECTION_ID, 'Students', [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any())
      ]);
      console.log("✅ Collection 'students' created with permissions!");
    } catch (err) {
      if (err.code === 409) console.log("⚠️ Collection already exists, continuing...");
      else throw err;
    }

    // 3. Create Attributes
    console.log("⚙️ Creating attributes... (this may take a minute)");
    const attributes = [
      { type: 'string', name: 'studentId', required: true },
      { type: 'string', name: 'name', required: true },
      { type: 'string', name: 'email', required: false },
      { type: 'string', name: 'phone', required: false },
      { type: 'string', name: 'branch', required: false },
      { type: 'integer', name: 'amountPaid', required: true },
      { type: 'string', name: 'paymentStatus', required: true },
      { type: 'boolean', name: 'checkedIn', required: false, default: false },
      { type: 'boolean', name: 'foodCollected', required: false, default: false },
      { type: 'string', name: 'checkInTime', required: false },
      { type: 'string', name: 'foodTime', required: false },
    ];

    for (const attr of attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(DB_ID, COLLECTION_ID, attr.name, 255, attr.required);
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(DB_ID, COLLECTION_ID, attr.name, attr.required);
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(DB_ID, COLLECTION_ID, attr.name, attr.required, attr.default);
        }
        console.log(`✅ Created attribute: ${attr.name}`);
        // Wait a bit to prevent rate limiting / allow attribute to initialize
        await new Promise(r => setTimeout(r, 1000));
      } catch (err) {
        if (err.code === 409) console.log(`⚠️ Attribute ${attr.name} already exists, skipping...`);
        else throw err;
      }
    }

    // Wait a few seconds before seeding to ensure all attributes are fully available
    console.log("⏳ Waiting for attributes to fully initialize...");
    await new Promise(r => setTimeout(r, 5000));

    // 4. Seed Test Data
    const testStudents = [
      { studentId: "TEST001", name: "Alice Johnson", branch: "CSE", amountPaid: 1300, paymentStatus: "completed", checkedIn: false, foodCollected: false },
      { studentId: "TEST002", name: "Bob Smith", branch: "ECE", amountPaid: 1300, paymentStatus: "completed", checkedIn: false, foodCollected: false },
      { studentId: "TEST003", name: "Charlie Davis", branch: "MECH", amountPaid: 1300, paymentStatus: "completed", checkedIn: false, foodCollected: false },
    ];

    for (const student of testStudents) {
      try {
        await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), student);
        console.log(`✅ Seeded student: ${student.name} (${student.studentId})`);
      } catch (err) {
        console.error(`❌ Failed to seed ${student.name}:`, err.message);
      }
    }

    console.log("\n🎉 Setup Complete! You can now log in and test the app using TEST001, TEST002, or TEST003.");

  } catch (error) {
    console.error("❌ Setup failed:", error);
  }
}

setup();
