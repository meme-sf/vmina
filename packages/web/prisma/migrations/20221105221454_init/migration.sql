-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "imagePaths" TEXT[],
    "title" TEXT,
    "details" TEXT,
    "txHash" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);
