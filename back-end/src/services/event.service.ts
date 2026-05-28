import prisma from "../config/prisma";

/* GET ALL EVENTS (SEARCH + FILTER + PAGINATION + UPCOMING ONLY) */
export const getAllEvents = async (query: any) => {
  const {
    search,
    category,
    location,
    page = "1",
    limit = "6",
  } = query;

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 6, 1);
  const skip = (pageNumber - 1) * limitNumber;

  return await prisma.events.findMany({
    where: {
      start_date: {
        gte: new Date(), // ✅ only upcoming events
      },
      AND: [
        search
          ? {
              OR: [
                {
                  title: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},

        category
          ? {
              category: {
                equals: category,
                mode: "insensitive",
              },
            }
          : {},

        location
          ? {
              location: {
                contains: location,
                mode: "insensitive",
              },
            }
          : {},
      ],
    },
    include: {
      tickets: true,
      vouchers: true, // 🔥 for promotion feature
    },
    orderBy: {
      start_date: "asc",
    },
    skip,
    take: limitNumber,
  });
};

/* GET EVENT BY ID */
export const getEventByIdService = async (id: number) => {
  return await prisma.events.findUnique({
    where: { id },
    include: {
      tickets: true,
      vouchers: true,
    },
  });
};

/* CREATE EVENT (WITH VALIDATION + TICKETS) */
export const createEventService = async (data: any) => {
  const {
    title,
    description,
    location,
    category,
    start_date,
    end_date,
    tickets,
    venue_name,
    venue_address,
    latitude,
    longitude,
  } = data;

  // 🔥 validation
  if (!title || !location || !category || !start_date || !end_date) {
    throw new Error("Missing required fields");
  }

  if (new Date(start_date) >= new Date(end_date)) {
    throw new Error("Invalid date range");
  }

  return await prisma.events.create({
    data: {
      title,
      description,
      location,
      category,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      venue_name: venue_name || null,
      venue_address: venue_address || null,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,

      tickets: tickets?.length
        ? {
            create: tickets.map((t: any) => {
              if (!t.name || t.price < 0 || t.quota <= 0) {
                throw new Error("Invalid ticket data");
              }

              return {
                name: t.name,
                price: Number(t.price),
                quota: Number(t.quota),
                sold: 0,
              };
            }),
          }
        : undefined,
    },
    include: {
      tickets: true,
    },
  });
};