-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other', 'undisclosed');

-- CreateTable
CREATE TABLE "drivers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passengers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "prefersNoConversation" BOOLEAN NOT NULL,

    CONSTRAINT "passengers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "drivers_cpf_key" ON "drivers"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "passengers_cpf_key" ON "passengers"("cpf");
