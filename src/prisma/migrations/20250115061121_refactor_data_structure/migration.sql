/*
  Warnings:

  - You are about to drop the column `description` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `prepTime` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the `RecipeFoodItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ingredients` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RecipeFoodItem" DROP CONSTRAINT "RecipeFoodItem_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeFoodItem" DROP CONSTRAINT "RecipeFoodItem_recipeId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "description",
DROP COLUMN "prepTime",
DROP COLUMN "title",
ADD COLUMN     "ingredients" JSONB NOT NULL;

-- DropTable
DROP TABLE "RecipeFoodItem";
