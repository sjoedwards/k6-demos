const { MongoClient } = require('mongodb');
// Replace the uri string with your MongoDB deployment's connection string.
const uri = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/test';
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db('test');
    const races = database.collection('races');
    const users = database.collection('users');
    // Query for a movie that has the title 'Back to the Future'
    const racesStatus = await races.deleteMany({});
    const usersStatus = await users.deleteMany({});
    console.log(
      'Deleted all records',
      'races',
      racesStatus,
      'users',
      usersStatus
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
