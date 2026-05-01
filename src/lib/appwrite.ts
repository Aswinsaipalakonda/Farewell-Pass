import { Client, Account, Databases } from 'appwrite';

export const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'your_project_id';
export const DB_ID = import.meta.env.VITE_DB_ID || 'farewell_db';
export const STUDENTS_COLLECTION_ID = import.meta.env.VITE_STUDENTS_COL || 'students';
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

export const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
