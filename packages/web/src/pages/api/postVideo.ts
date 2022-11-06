import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../lib/prisma";

const postValidation = async (data) => {
    const resp = await prisma.video.create({
      data: {
        imagePaths: data.imagePaths,
        title: data.title,
        details: data.details,
        price: data.price
      },
    });
    return resp
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);

  const data = {
    imagePaths: req.body.imagePaths,
    title: req.body.title,
    details: req.body.details ? req.body.details : '',
    price: JSON.parse(req.body.price),
  }
  console.log(data);
  const resp = await postValidation(data)
  console.log(resp);
  if(resp) {
      res.status(200).json({"message":"Added successfully"})
  } else {
      res.status(500).json({"message":"Sorry, Something went wrong"})
  }
};
export default handler;
