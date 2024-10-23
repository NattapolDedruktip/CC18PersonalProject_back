/*
  Warnings:

  - You are about to alter the column `update_at` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `update_at` on the `Hotel` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `update_at` on the `HotelImage` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `update_at` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `isPaid` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `update_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `Hotel` MODIFY `update_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `HotelImage` MODIFY `update_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` MODIFY `update_at` TIMESTAMP NOT NULL;
