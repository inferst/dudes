-- CreateTable
CREATE TABLE "Command" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "text" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "cooldown" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Command_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
