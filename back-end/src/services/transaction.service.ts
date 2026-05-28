import prisma from "../config/prisma";

export const createTransactionService = async (data: any) => {
  const { ticket_id, quantity, voucher_id, use_points = false } = data;

  if (!ticket_id || !quantity || quantity <= 0) {
    throw new Error("Invalid input");
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Get ticket
    const ticket = await tx.tickets.findUnique({
      where: { id: ticket_id },
    });

    if (!ticket) throw new Error("Ticket not found");

    const sold = ticket.sold || 0;
    const quota = ticket.quota || 0;
    const remaining = quota - sold;

    if (quantity > remaining) {
      throw new Error("Not enough seats");
    }

    const price = ticket.price || 0;
    const subtotal = price * quantity;

    // 🔥 2. Voucher logic
    let discount = 0;
    let voucherUsed = false;

    if (voucher_id) {
      const voucher = await tx.vouchers.findUnique({
        where: { id: voucher_id },
      });

      if (!voucher) throw new Error("Voucher not found");

      const now = new Date();

      if (voucher.start_date! > now || voucher.end_date! < now) {
        throw new Error("Voucher expired");
      }

      if ((voucher.used_count || 0) >= (voucher.quota || 0)) {
        throw new Error("Voucher quota exceeded");
      }

      discount = voucher.discount_amount || 0;
      voucherUsed = true;

      await tx.vouchers.update({
        where: { id: voucher_id },
        data: {
          used_count: { increment: 1 },
        },
      });
    }

    // 🔥 3. Points usage
    const userId = 2; // your dummy user

    const user = await tx.users.findUnique({
      where: { id: userId },
    });

    let pointsUsed = 0;

    if (use_points && user?.points_balance) {
      pointsUsed = Math.min(user.points_balance, subtotal - discount);
    }

    const final_price = Math.max(subtotal - discount - pointsUsed, 0);

    // 🔥 4. Expiry (2 hours)
    const expired_at = new Date(Date.now() + 2 * 60 * 60 * 1000);

    // 🔥 5. Create transaction (FIXED STATUS)
    const transaction = await tx.transactions.create({
      data: {
        user_id: userId,
        event_id: ticket.event_id!,
        total_price: subtotal,
        original_price: subtotal,
        discount_amount: discount + pointsUsed,
        final_price,
        status: "PENDING", // ✅ FIXED
        expired_at,
        voucher_id: voucher_id || null,
      },
    });

    // 🔥 6. Transaction item
    await tx.transaction_items.create({
      data: {
        transaction_id: transaction.id,
        ticket_id: ticket.id,
        quantity,
        price,
        subtotal,
      },
    });

    // 🔥 7. Update seats
    await tx.tickets.update({
      where: { id: ticket.id },
      data: {
        sold: {
          increment: quantity,
        },
      },
    });

    // 🔥 8. Deduct points
    if (pointsUsed > 0) {
      await tx.users.update({
        where: { id: userId },
        data: {
          points_balance: {
            decrement: pointsUsed,
          },
        },
      });
    }

    return transaction;
  });
};