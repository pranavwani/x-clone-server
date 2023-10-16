-- CreateTable
CREATE TABLE "Follows" (
    "followerID" TEXT NOT NULL,
    "followingID" TEXT NOT NULL,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("followerID","followingID")
);

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerID_fkey" FOREIGN KEY ("followerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingID_fkey" FOREIGN KEY ("followingID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
