-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "imagePaths" TEXT[],
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "txHash" TEXT NOT NULL,
    "ownerAddress" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);
