import { Request, Response } from 'express';
import GoTiny from '../mongoose';

export default async (req: Request, res: Response) => {
  const goTinyObject = await GoTiny.findOne({ code: req.params.id });

  if (!goTinyObject) {
    const errorPage = new URL('https://gotiny.cc/404.html');
    errorPage.searchParams.set('code', req.params.id);

    res.redirect(errorPage.href);
    return;
  }

  const noProtocol = !goTinyObject.long.startsWith('http');

  const url = new URL([noProtocol ? 'http://' : '', goTinyObject.long].join(''));

  res.redirect(url.href);

  await GoTiny.updateOne(
    { _id: goTinyObject._id },
    {
      $set: { lastActive: Date.now() },
      $inc: { visited: 1 },
    },
  );
};
