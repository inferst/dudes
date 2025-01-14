-- CreateTable
CREATE TABLE "SkinCollection" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "SkinCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skin" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "collectionId" INTEGER NOT NULL,

    CONSTRAINT "Skin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSkinCollection" (
    "id" SERIAL NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    "skinCollectionId" INTEGER NOT NULL,

    CONSTRAINT "UserSkinCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSkin" (
    "id" SERIAL NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "skinId" INTEGER NOT NULL,

    CONSTRAINT "UserSkin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SkinCollection_name_key" ON "SkinCollection"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skin_collectionId_name_key" ON "Skin"("collectionId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "UserSkinCollection_skinCollectionId_userId_key" ON "UserSkinCollection"("skinCollectionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSkin_skinId_userId_key" ON "UserSkin"("skinId", "userId");

-- AddForeignKey
ALTER TABLE "Skin" ADD CONSTRAINT "Skin_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "SkinCollection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkinCollection" ADD CONSTRAINT "UserSkinCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkinCollection" ADD CONSTRAINT "UserSkinCollection_skinCollectionId_fkey" FOREIGN KEY ("skinCollectionId") REFERENCES "SkinCollection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkin" ADD CONSTRAINT "UserSkin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkin" ADD CONSTRAINT "UserSkin_skinId_fkey" FOREIGN KEY ("skinId") REFERENCES "Skin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
