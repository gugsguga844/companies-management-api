-- CreateTable
CREATE TABLE "AccountingFirm" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "password" VARCHAR(45) NOT NULL,
    "cnpj" VARCHAR(45) NOT NULL,
    "phone" VARCHAR(45) NOT NULL,
    "fantasy_name" VARCHAR(120),

    CONSTRAINT "AccountingFirm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "trade_name" VARCHAR(120),
    "cnpj" VARCHAR(45) NOT NULL,
    "activity" VARCHAR(120),
    "accounting_fee" DECIMAL(10,2) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "accounting_firm_id" INTEGER NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "reference_month" DATE NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(45) NOT NULL,
    "payment_date" DATE,
    "due_date" DATE NOT NULL,
    "company_id" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountingFirm_email_key" ON "AccountingFirm"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AccountingFirm_cnpj_key" ON "AccountingFirm"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Company_cnpj_key" ON "Company"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_accounting_firm_id_fkey" FOREIGN KEY ("accounting_firm_id") REFERENCES "AccountingFirm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
