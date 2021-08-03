import { MongoClient } from "mongodb";

export async function connectDatabase() {
  const uri = process.env.ATLAS_URI_EVENTS
  const client = await MongoClient.connect(
    uri
  )

  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db();

  const result = await db.collection(collection).insertOne(document)
  return result;
}

export async function getAllDocuments(client, collection, sort) {
  const db = client.db();

  const documents = await db
    .collection(collection)
    .find()
    .sort(sort) //降順
    .toArray();

  return documents;

}