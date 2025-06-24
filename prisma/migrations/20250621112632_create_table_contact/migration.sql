-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "email" VARCHAR(100),
    "phone" VARCHAR(20),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
