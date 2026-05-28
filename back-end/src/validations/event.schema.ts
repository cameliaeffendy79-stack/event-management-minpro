import { z } from "zod";

export const ticketSchema = z.object({
  name: z.string().min(1),

  price: z.number().min(0),

  quota: z.number().min(1),
});

export const createEventSchema =
  z.object({
    title: z.string().min(3),

    description:
      z.string().optional(),

    start_date: z.string(),

    end_date: z.string(),

    category:
      z.string().optional(),

    location:
      z.string().optional(),

    venue_name:
      z.string().optional(),

    venue_address:
      z.string().optional(),

    latitude:
      z.number().optional(),

    longitude:
      z.number().optional(),

    tickets: z
      .array(ticketSchema)
      .optional(),
  });