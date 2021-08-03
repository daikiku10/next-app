import { MongoClient } from 'mongodb';

async function handler(req, res) {
  if (req.method === 'POST') {
    const userEmail = req.body.email;

    if (!userEmail || !userEmail.includes('@')) {
      res.status(422).json({message: '無効なメールアドレスです！'});
      return;
    }
    // 本来はここまで処理が来ればDBへ保存する処理を実装する
    const uri = process.env.ATLAS_URI
    const client = await MongoClient.connect(
      uri,
    )
    const db = client.db();

    await db.collection('emails').insertOne({email: userEmail})

    client.close();

    res.status(201).json({ message: 'Signed up!'});
  }
}

export default handler;