const mongoose = require('mongoose');

const localUri = 'mongodb://127.0.0.1:27017/millionaire-numbers';
const remoteUri = 'mongodb+srv://infinologylexvra_db_user:MAhe13iwPZxrNx63@cluster0.qmd8a2o.mongodb.net/millionaire?retryWrites=true&w=majority&appName=Cluster0';

async function migrate() {
  try {
    console.log('Connecting to local DB...');
    const localConn = await mongoose.createConnection(localUri).asPromise();
    
    console.log('Connecting to remote DB...');
    const remoteConn = await mongoose.createConnection(remoteUri).asPromise();

    const collections = await localConn.db.listCollections().toArray();
    
    for (const col of collections) {
      const collectionName = col.name;
      console.log(`Migrating collection: ${collectionName}`);
      
      const localData = await localConn.db.collection(collectionName).find({}).toArray();
      
      if (localData.length > 0) {
        // Drop existing collection on remote if exists
        try {
          await remoteConn.db.collection(collectionName).drop();
        } catch (e) {
          // Ignore drop error if collection doesn't exist
        }
        
        await remoteConn.db.collection(collectionName).insertMany(localData);
        console.log(`Successfully migrated ${localData.length} documents for ${collectionName}`);
      } else {
        console.log(`No documents found in ${collectionName}, skipping.`);
      }
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
