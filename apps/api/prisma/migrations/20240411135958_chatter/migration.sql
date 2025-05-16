-- CreateTable
CREATE TABLE "Chatter" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "chatterName" TEXT NOT NULL,
    "sprite" TEXT NOT NULL,

    CONSTRAINT "Chatter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chatter" ADD CONSTRAINT "Chatter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
