import { Request, Response } from "express";
import GoTiny from "../mongoose";
import { constructError } from "../utils";

export default async (req: Request, res: Response) => {
  const goTinyObject = await GoTiny.findOne({ code: req.params.id });

  if (!goTinyObject) {
    res.status(404).send(constructError("no-matches", "GoTiny link not found"));
    return;
  }

  if (req.query.format === "json") {
    res.json({
      code: goTinyObject.code,
      long: goTinyObject.long,
    });
  } else {
    res.send(goTinyObject.long);
  }

  await GoTiny.updateOne(
    { _id: goTinyObject._id },
    {
      $set: { lastActive: Date.now() },
      $inc: { visited: 1 },
    }
  );
};
