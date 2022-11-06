-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "imagePaths" TEXT[],
    "title" TEXT NOT NULL,
    "details" TEXT,
    "price" INTEGER NOT NULL,
    "txHash" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);
