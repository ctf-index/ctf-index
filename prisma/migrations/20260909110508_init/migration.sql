-- CreateEnum
CREATE TYPE "Link_Status" AS ENUM ('alive', 'dead');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'verified', 'rejected');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Walkthrough" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "link_status" "Link_Status" NOT NULL DEFAULT 'alive',
    "last_checked_at" TIMESTAMP(3) NOT NULL,
    "quality_score" INTEGER NOT NULL,
    "archived_snapshot_link" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "adminId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Walkthrough_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalkthroughCategory" (
    "walkthrough_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "WalkthroughCategory_pkey" PRIMARY KEY ("walkthrough_id","category_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Walkthrough" ADD CONSTRAINT "Walkthrough_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalkthroughCategory" ADD CONSTRAINT "WalkthroughCategory_walkthrough_id_fkey" FOREIGN KEY ("walkthrough_id") REFERENCES "Walkthrough"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalkthroughCategory" ADD CONSTRAINT "WalkthroughCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
