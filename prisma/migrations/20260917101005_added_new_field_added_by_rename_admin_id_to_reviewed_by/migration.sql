/*
  Warnings:

  - You are about to drop the column `adminId` on the `Walkthrough` table. All the data in the column will be lost.
  - Added the required column `added_By` to the `Walkthrough` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewed_by` to the `Walkthrough` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Walkthrough" DROP CONSTRAINT "Walkthrough_adminId_fkey";

-- AlterTable
ALTER TABLE "Walkthrough" DROP COLUMN "adminId",
ADD COLUMN     "added_By" TEXT NOT NULL,
ADD COLUMN     "reviewed_by" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Walkthrough" ADD CONSTRAINT "Walkthrough_added_By_fkey" FOREIGN KEY ("added_By") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Walkthrough" ADD CONSTRAINT "Walkthrough_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
