/*
  Warnings:

  - You are about to drop the column `age` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `passengers` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `passengers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "drivers" DROP COLUMN "age",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "passengers" DROP COLUMN "age",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL;
