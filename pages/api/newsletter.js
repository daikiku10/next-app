function handler(req, res) {
  if (req.method === 'POST') {
    console.log(req.body)
    const userEmail = req.body.email;
    console.log(userEmail)

    if (!userEmail || !userEmail.includes('@')) {
      res.status(422).json({message: '無効なメールアドレスです！'});
      return;
    }
    // 本来はここまで処理が来ればDBへ保存する処理を実装する
    console.log('12行目', userEmail);
    res.status(201).json({ message: 'Signed up!'});
  }
}

export default handler;