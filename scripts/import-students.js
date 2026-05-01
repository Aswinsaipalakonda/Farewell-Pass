import { Client, Databases, Query, Permission, Role, ID } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DB_ID = process.env.VITE_DB_ID;
const COLLECTION_ID = 'students';

if (!PROJECT_ID || !API_KEY || !DB_ID) {
  console.error("❌ Missing required environment variables!");
  process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

const studentData = [
  { id: "23331A4203", branch: "CSM" },
  { id: "23331A4205", branch: "CSM" },
  { id: "23331A4207", branch: "CSM" },
  { id: "23331A4212", branch: "CSM" },
  { id: "23331A4214", branch: "CSM" },
  { id: "23331A4216", branch: "CSM" },
  { id: "23331A4218", branch: "CSM" },
  { id: "23331A4224", branch: "CSM" },
  { id: "23331A4225", branch: "CSM" },
  { id: "23331A4229", branch: "CSM" },
  { id: "23331A4240", branch: "CSM" },
  { id: "23331A4244", branch: "CSM" },
  { id: "23331A4249", branch: "CSM" },
  { id: "23331A4254", branch: "CSM" },
  { id: "23331A4256", branch: "CSM" },
  { id: "23331A4258", branch: "CSM" },
  { id: "23331A4414", branch: "CSD" },
  { id: "23331A4416", branch: "CSD" },
  { id: "23331A4417", branch: "CSD" },
  { id: "23331A4427", branch: "CSD" },
  { id: "23331A4441", branch: "CSD" },
  { id: "23331A4449", branch: "CSD" },
  { id: "23331A4462", branch: "CSD" },
  { id: "23331A4463", branch: "CSD" },
  { id: "23331A4701", branch: "CIC" },
  { id: "23331A4704", branch: "CIC" },
  { id: "23331A4708", branch: "CIC" },
  { id: "23331A4715", branch: "CIC" },
  { id: "23331A4717", branch: "CIC" },
  { id: "23331A4718", branch: "CIC" },
  { id: "23331A4721", branch: "CIC" },
  { id: "23331A4730", branch: "CIC" },
  { id: "23331A4731", branch: "CIC" },
  { id: "23331A4732", branch: "CIC" },
  { id: "23331A4733", branch: "CIC" },
  { id: "23331A4737", branch: "CIC" },
  { id: "23331A4739", branch: "CIC" },
  { id: "23331A4741", branch: "CIC" },
  { id: "23331A4742", branch: "CIC" },
  { id: "23331A4743", branch: "CIC" },
  { id: "23331A4744", branch: "CIC" },
  { id: "23331A4745", branch: "CIC" },
  { id: "23331A4746", branch: "CIC" },
  { id: "23331A4748", branch: "CIC" },
  { id: "23331A4749", branch: "CIC" },
  { id: "23331A4752", branch: "CIC" },
  { id: "23331A4753", branch: "CIC" },
  { id: "23331A4754", branch: "CIC" },
  { id: "23331A4755", branch: "CIC" },
  { id: "23331A4759", branch: "CIC" },
  { id: "23331A4760", branch: "CIC" },
  { id: "23331A4761", branch: "CIC" },
  { id: "23331A4763", branch: "CIC" },
  { id: "23331A4764", branch: "CIC" },
];

async function run() {
  try {
    console.log("🧹 Clearing existing students...");
    const existing = await databases.listDocuments(DB_ID, COLLECTION_ID, [Query.limit(1000)]);
    for (const doc of existing.documents) {
      await databases.deleteDocument(DB_ID, COLLECTION_ID, doc.$id);
      console.log(`🗑 Deleted: ${doc.studentId}`);
    }

    console.log("\n📥 Importing new students...");
    for (const student of studentData) {
      const data = {
        studentId: student.id,
        name: student.id, // Using ID as name as requested
        branch: student.branch,
        amountPaid: 1300,
        paymentStatus: "completed",
        checkedIn: false,
        foodCollected: false,
        checkInTime: "",
        foodTime: ""
      };

      await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), data);
      console.log(`✅ Added: ${student.id} (${student.branch})`);
    }

    console.log("\n🎉 All done! Database is ready for the event.");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

run();
