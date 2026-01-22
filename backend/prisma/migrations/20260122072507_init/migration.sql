-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "inr_balance" DOUBLE PRECISION NOT NULL DEFAULT 100000.00,
    "foreign_balances" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currency_exchange_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "inr_amount" DOUBLE PRECISION NOT NULL,
    "target_currency" TEXT NOT NULL,
    "exchange_rate" DOUBLE PRECISION NOT NULL,
    "foreign_amount" DOUBLE PRECISION NOT NULL,
    "remaining_balance" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "currency_exchange_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_investment_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "stock_name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "price_at_investment" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "prediction" TEXT NOT NULL DEFAULT 'Neutral',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_investment_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- CreateIndex
CREATE INDEX "currency_exchange_history_user_id_idx" ON "currency_exchange_history"("user_id");

-- CreateIndex
CREATE INDEX "stock_investment_history_user_id_idx" ON "stock_investment_history"("user_id");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "currency_exchange_history" ADD CONSTRAINT "currency_exchange_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_investment_history" ADD CONSTRAINT "stock_investment_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
