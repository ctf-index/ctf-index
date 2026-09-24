/*
  Warnings:

  - You are about to drop the column `added_By` on the `Walkthrough` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[link]` on the table `Walkthrough` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `added_by` to the `Walkthrough` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Walkthrough" DROP CONSTRAINT "Walkthrough_added_By_fkey";

-- DropForeignKey
ALTER TABLE "Walkthrough" DROP CONSTRAINT "Walkthrough_reviewed_by_fkey";

-- AlterTable
ALTER TABLE "Walkthrough" DROP COLUMN "added_By",
ADD COLUMN     "added_by" TEXT NOT NULL,
ALTER COLUMN "reviewed_by" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Walkthrough_link_key" ON "Walkthrough"("link");

-- AddForeignKey
ALTER TABLE "Walkthrough" ADD CONSTRAINT "Walkthrough_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Walkthrough" ADD CONSTRAINT "Walkthrough_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
