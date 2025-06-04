-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('LOW_STOCK', 'AVAILABLE', 'OUT_OF_STOCK', 'UNDER_MAINTENANCE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('BORROW', 'CONSUME');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('RETURNED', 'NOT_RETURNED', 'CONSUMED');

-- CreateTable
CREATE TABLE "inventory_items" (
    "item_id" VARCHAR(10) NOT NULL,
    "category_id" TEXT NOT NULL,
    "item_name" VARCHAR(100) NOT NULL,
    "unit_measure" VARCHAR(20) NOT NULL,
    "current_stock" INTEGER NOT NULL DEFAULT 0,
    "reorder_level" INTEGER NOT NULL DEFAULT 0,
    "status" "InventoryStatus" NOT NULL,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_updated" TIMESTAMP(3) NOT NULL,
    "isdeleted" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "batches" (
    "batch_id" VARCHAR(10) NOT NULL,
    "item_id" TEXT NOT NULL,
    "f_item_id" VARCHAR(10) NOT NULL,
    "usable_quantity" INTEGER NOT NULL DEFAULT 0,
    "defective_quantity" INTEGER NOT NULL DEFAULT 0,
    "missing_quantity" INTEGER NOT NULL DEFAULT 0,
    "expiration_date" TIMESTAMP(3),
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "isdeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("batch_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" VARCHAR(10) NOT NULL,
    "category_name" VARCHAR(100) NOT NULL,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isdeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "employee_requests" (
    "request_id" VARCHAR(10) NOT NULL,
    "item_id" TEXT NOT NULL,
    "emp_id" VARCHAR(10) NOT NULL,
    "request_type" "RequestType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "req_purpose" VARCHAR(255) NOT NULL,
    "status" "RequestStatus" NOT NULL,
    "expected_return_date" TIMESTAMP(3),
    "actual_return_date" TIMESTAMP(3),
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_updated" TIMESTAMP(3) NOT NULL,
    "isdeleted" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "employee_requests_pkey" PRIMARY KEY ("request_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_name_key" ON "categories"("category_name");

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_requests" ADD CONSTRAINT "employee_requests_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;
