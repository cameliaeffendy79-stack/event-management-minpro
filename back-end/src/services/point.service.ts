import prisma from "../prisma/client";

export async function getActivePoints(
  userId: number
) {
  const points =
    await prisma.points.findMany({
      where: {
        user_id: userId,

        is_used: false,

        expired_at: {
          gt: new Date(),
        },
      },
    });

  return points.reduce(
    (total, point) =>
      total + (point.amount || 0),
    0
  );
}