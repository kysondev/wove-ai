/*
  Warnings:

  - You are about to drop the column `parentMessageId` on the `chat_message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."chat_message" DROP CONSTRAINT "chat_message_parentMessageId_fkey";

-- AlterTable
ALTER TABLE "public"."chat_message" DROP COLUMN "parentMessageId";
