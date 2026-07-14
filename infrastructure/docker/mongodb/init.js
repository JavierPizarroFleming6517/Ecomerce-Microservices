db = db.getSiblingDB('retail_catalog');

db.createCollection('bootstrap');
db.bootstrap.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
db.bootstrap.insertOne({ createdAt: new Date(), purpose: 'local-readiness' });
