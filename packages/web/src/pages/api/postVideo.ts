import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../lib/prisma";

const postValidation = async (data) => {
    const resp = await prisma.video.create({
      data: {
        imagePaths: data.imagePaths,
      },
    });
    return resp
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);

  const data = {
    imagePaths: req.body.imagePaths,
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
