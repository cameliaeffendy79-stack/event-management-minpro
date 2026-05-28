import prisma from "../config/prisma";

/* EXPIRE TRANSACTIONS (2 HOURS) */
export const expireTransactions = async () => {
  const now = new Date();

  const expiredTransactions = await prisma.transactions.findMany({
    where: {
      status: "WAITING_FOR_PAYMENT",
      expired_at: {
        lte: now,
      },
    },
    include: {
      transaction_items: true,
    },
  });

  for (const trx of expiredTransactions) {
    // 🔁 restore seats
    for (const item of trx.transaction_items) {
      await prisma.tickets.update({
        where: { id: item.ticket_id! },
        data: {
          sold: {
            decrement: item.quantity!,
          },
        },
      });
    }

    // 🔄 update status
    await prisma.transactions.update({
      where: { id: trx.id },
      data: {
        status: "EXPIRED",
      },
    });
  }

  console.log(`Expired ${expiredTransactions.length} transactions`);
};

/* AUTO CANCEL (3 DAYS NO CONFIRMATION) */
export const autoCancelTransactions = async () => {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const transactions = await prisma.transactions.findMany({
    where: {
      status: "WAITING_FOR_CONFIRMATION",
      created_at: {
        lte: threeDaysAgo,
      },
    },
    include: {
      transaction_items: true,
    },
  });

  for (const trx of transactions) {
    // 🔁 restore seats
    for (const item of trx.transaction_items) {
      await prisma.tickets.update({
        where: { id: item.ticket_id! },
        data: {
          sold: {
            decrement: item.quantity!,
          },
        },
      });
    }

    await prisma.transactions.update({
      where: { id: trx.id },
      data: {
        status: "CANCELED",
      },
    });
  }

  console.log(`Canceled ${transactions.length} transactions`);
};