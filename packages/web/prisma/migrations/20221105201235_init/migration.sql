-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "imagePaths" TEXT[],
    "title" TEXT,
    "detail" TEXT,
    "txHash" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);
