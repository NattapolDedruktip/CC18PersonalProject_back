-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `date_of_birth` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'ETC') NULL,
    `payment_method` ENUM('CASH', 'CREDIT', 'PROMTPAY') NOT NULL DEFAULT 'CASH',
    `role` ENUM('USER', 'HOST') NOT NULL,
    `userImage` VARCHAR(191) NULL,
    `imagePublicId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date_create` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP NOT NULL,
    `price` INTEGER NULL,
    `isBook` BOOLEAN NOT NULL DEFAULT true,
    `isSlipSend` BOOLEAN NOT NULL DEFAULT false,
    `availiableTimeId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `hotelId` INTEGER NOT NULL,

    UNIQUE INDEX `Booking_availiableTimeId_key`(`availiableTimeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date_create` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP NOT NULL,
    `netSpend` INTEGER NOT NULL,
    `status` ENUM('UNPAID', 'PENDING', 'PAID', 'CANCEL', 'COMPLETE') NOT NULL DEFAULT 'UNPAID',
    `public_id` VARCHAR(191) NULL,
    `secure_url` VARCHAR(191) NULL,
    `booking_id` INTEGER NOT NULL,

    UNIQUE INDEX `Transaction_booking_id_key`(`booking_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hotel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP NOT NULL,
    `hotel_name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `description` VARCHAR(255) NULL,
    `host_contact` VARCHAR(191) NOT NULL,
    `lat` DOUBLE NULL,
    `lng` DOUBLE NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fee` INTEGER NOT NULL,
    `seviceName` VARCHAR(191) NOT NULL,
    `hotelId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HotelImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP NOT NULL,
    `url` VARCHAR(191) NULL,
    `asset_id` VARCHAR(191) NULL,
    `public_id` VARCHAR(191) NULL,
    `secure_url` VARCHAR(191) NULL,
    `hotelId` INTEGER NOT NULL,

    UNIQUE INDEX `HotelImage_public_id_key`(`public_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AvailiableTime` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startDate` VARCHAR(191) NOT NULL,
    `endDate` VARCHAR(191) NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `isBooking` BOOLEAN NOT NULL DEFAULT false,
    `price` INTEGER NOT NULL,
    `hotelId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_availiableTimeId_fkey` FOREIGN KEY (`availiableTimeId`) REFERENCES `AvailiableTime`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hotel` ADD CONSTRAINT `Hotel_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HotelImage` ADD CONSTRAINT `HotelImage_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvailiableTime` ADD CONSTRAINT `AvailiableTime_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
