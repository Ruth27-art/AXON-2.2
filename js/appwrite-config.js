// js/appwrite-config.js
import { Client, Account, Databases, Storage, ID, Permission, Role } from 'https://cdn.jsdelivr.net/npm/appwrite@14.0.0/+esm';
import { DATABASE_ID, LABS_COLLECTION_ID, DOCUMENTS_BUCKET_ID } from './constants.js';

// Exportar IDs para uso en otros archivos
export { DATABASE_ID, LABS_COLLECTION_ID, DOCUMENTS_BUCKET_ID, ID, Permission, Role };

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('69e8df29003c99e7a35e'); // Tu Project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Variable para usuario actual
export let currentUser = null;

export async function updateCurrentUser() {
    try {
        currentUser = await account.get();
        return currentUser;
    } catch (error) {
        currentUser = null;
        return null;
    }
}

// Función para obtener usuario actual de forma síncrona
export function getCurrentUser() {
    return currentUser;
}

console.log('✅ Appwrite configurado correctamente');