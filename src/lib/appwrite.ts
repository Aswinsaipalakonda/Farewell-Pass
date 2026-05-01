import { Client, Account, Databases } from 'appwrite';

// Ensure environment variables are loaded and trimmed
const rawProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const rawEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;

export const PROJECT_ID = (rawProjectId || '').trim() || 'your_project_id';
export const DB_ID = (import.meta.env.VITE_DB_ID || '').trim() || '69f4e9d3003de351b7c3';
export const STUDENTS_COLLECTION_ID = (import.meta.env.VITE_STUDENTS_COL || '').trim() || 'students';
const APPWRITE_ENDPOINT = (rawEndpoint || '').trim() || 'https://cloud.appwrite.io/v1';

if (!rawProjectId || !rawEndpoint) {
    console.warn('⚠️ Appwrite environment variables are missing! Login will likely fail.');
}

export const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

