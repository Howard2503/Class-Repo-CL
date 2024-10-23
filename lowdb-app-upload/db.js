// db.js
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node'; // Make sure you're importing from 'lowdb/node'
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Lowdb to write to a JSON file
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Initialize the data structure if the file is empty
async function initDb() {
    await db.read();
    db.data = db.data || { entries: [] }; // Initialize empty entries array if file is empty
    await db.write();
}

await initDb();

export default db;
