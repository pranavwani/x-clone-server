-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "parentPostID" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_parentPostID_fkey" FOREIGN KEY ("parentPostID") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
