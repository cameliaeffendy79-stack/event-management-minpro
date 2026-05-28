import cron from "node-cron";

import prisma from "../prisma/client";

// ✅ RUN EVERY DAY AT MIDNIGHT
cron.schedule("0 0 * * *", async () => {
  console.log(
    "Running point expiration cron..."
  );

  // cari point expired
  const expiredPoints =
    await prisma.points.findMany({
      where: {
        is_used: false,

        expired_at: {
          lt: new Date(),
        },
      },
    });

  for (const point of expiredPoints) {
    // skip kalau amount null
    if (!point.amount) continue;

    // update point jadi unusable
    await prisma.points.update({
      where: {
        id: point.id,
      },

      data: {
        is_used: true,
      },
    });

    // kurangi balance user
    await prisma.users.update({
      where: {
        id: point.user_id || 0,
      },

      data: {
        points_balance: {
          decrement: point.amount,
        },
      },
    });
  }

  console.log(
    `Expired ${expiredPoints.length} points`
  );
});