import { MongoClient } from 'mongodb';

async function handler(req, res) {
  const eventId = req.query.eventId;

  const uri = process.env.ATLAS_URI_EVENTS
  const client = await MongoClient.connect(uri)


  if (req.method === 'POST') {
    // add server-side validation
    const { email, name, text } = req.body;

    if (
      !email.includes('@') ||
      !name ||
      name.trim() === '' ||
      !text ||
      text.trim() === ''
    ) {
      res.status(422).json({ message: '無効な入力値です!' });
      return;
    }

    const newComment = {
      email,
      name,
      text,
      eventId
    }

    
    const db = client.db();
    
    const result = await db.collection('comments').insertOne(newComment);
    
    console.log(result);
    
    newComment.id = result.insertedId;

    res.status(201).json({ message: 'コメント追加', comment: newComment });

  }

  if (req.method === 'GET') {
    const dummyList = [
      { id: 'c1', name: 'Max', text: 'A first comment!' },
      { id: 'c2', name: 'Manuel', text: 'A second comment!' },
    ];

    res.status(200).json({ comments: dummyList });
  }

  client.close()
}

export default handler;