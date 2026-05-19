import { Request, Response } from "express";
import prisma from "../prisma/client";
import {
  TransactionStatus,
  Role,
} from "@prisma/client";
import { uploadToCloudinary } from "../services/upload.service";

//////////////////////////////////////////////////
// ✅ CREATE TRANSACTION
//////////////////////////////////////////////////
export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;

    // ✅ CUSTOMER ONLY
    if (
      !user ||
      user.role !== Role.CUSTOMER
    ) {
      res.status(403).json({
        message:
          "Only customer can book event",
      });

      return;
    }

    const {
      event_id,
      ticket_id,
      quantity,
    } = req.body;

    // ✅ VALIDATE QUANTITY
    if (!quantity || quantity < 1) {
      res.status(400).json({
        message:
          "Quantity must be at least 1",
      });

      return;
    }

    // ✅ FIND EVENT
    const event =
      await prisma.events.findUnique({
        where: {
          id: Number(event_id),
        },
      });

    if (!event) {
      res.status(404).json({
        message: "Event not found",
      });

      return;
    }

    // ✅ PREVENT ORGANIZER BUY OWN EVENT
    if (event.organizer_id === user.id) {
      res.status(400).json({
        message:
          "Organizer cannot buy own event",
      });

      return;
    }

    // ✅ FIND TICKET
    const ticket =
      await prisma.tickets.findUnique({
        where: {
          id: Number(ticket_id),
        },
      });

    if (!ticket) {
      res.status(404).json({
        message: "Ticket not found",
      });

      return;
    }

    // ✅ CHECK TICKET EVENT
    if (
      ticket.event_id !==
      Number(event_id)
    ) {
      res.status(400).json({
        message:
          "Ticket does not belong to this event",
      });

      return;
    }

    // ✅ CHECK QUOTA
    const available =
      (ticket.quota || 0) -
      (ticket.sold || 0);

    if (available < quantity) {
      res.status(400).json({
        message:
          "Not enough ticket quota",
      });

      return;
    }

    const totalPrice =
      (ticket.price || 0) * quantity;

    // ✅ CREATE TRANSACTION
    const transaction =
      await prisma.transactions.create({
        data: {
          user_id: user.id,

          event_id:
            Number(event_id),

          status:
            TransactionStatus.PENDING,

          total_price: totalPrice,

          final_price: totalPrice,

          transaction_items: {
            create: {
              ticket_id:
                Number(ticket_id),

              quantity,

              price:
                ticket.price || 0,

              subtotal:
                totalPrice,
            },
          },
        },

        include: {
          transaction_items: {
            include: {
              tickets: true,
            },
          },

          events: true,
        },
      });

    // ✅ UPDATE SOLD TICKET
    await prisma.tickets.update({
      where: {
        id: Number(ticket_id),
      },

      data: {
        sold: {
          increment: quantity,
        },
      },
    });

    res.status(201).json({
      message:
        "Booking created successfully",

      data: transaction,
    });
  } catch (error: any) {
    res.status(500).json({
      message:
        error.message ||
        "Error creating transaction",
    });
  }
};

//////////////////////////////////////////////////
// ✅ GET MY TRANSACTIONS
//////////////////////////////////////////////////
export const getMyTransactions =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user = (req as any).user;

      const transactions =
        await prisma.transactions.findMany({
          where: {
            user_id: user.id,
          },

          include: {
            events: true,

            transaction_items: {
              include: {
                tickets: true,
              },
            },
          },

          orderBy: {
            created_at: "desc",
          },
        });

      res.status(200).json({
        data: transactions,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

//////////////////////////////////////////////////
// ✅ ORGANIZER GET TRANSACTIONS
//////////////////////////////////////////////////
export const getOrganizerTransactions =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user = (req as any).user;

      // ✅ ORGANIZER ONLY
      if (
        !user ||
        user.role !== Role.ORGANIZER
      ) {
        res.status(403).json({
          message:
            "Only organizer can access",
        });

        return;
      }

      const transactions =
        await prisma.transactions.findMany({
          where: {
            events: {
              organizer_id: user.id,
            },
          },

          include: {
            users: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },

            events: true,

            transaction_items: {
              include: {
                tickets: true,
              },
            },
          },

          orderBy: {
            created_at: "desc",
          },
        });

      res.status(200).json({
        data: transactions,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

//////////////////////////////////////////////////
// ✅ ACCEPT TRANSACTION
//////////////////////////////////////////////////
export const acceptTransaction =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);

      const user = (req as any).user;

      // ✅ ORGANIZER ONLY
      if (
        !user ||
        user.role !== Role.ORGANIZER
      ) {
        res.status(403).json({
          message:
            "Only organizer can accept",
        });

        return;
      }

      const transaction =
        await prisma.transactions.findUnique({
          where: { id },

          include: {
            events: true,
          },
        });

      if (!transaction) {
        res.status(404).json({
          message:
            "Transaction not found",
        });

        return;
      }

      // ✅ OWNER CHECK
      if (
        transaction.events
          ?.organizer_id !== user.id
      ) {
        res.status(403).json({
          message: "Forbidden",
        });

        return;
      }

      // ✅ PREVENT DOUBLE ACCEPT
      if (
        transaction.status ===
        TransactionStatus.ACCEPTED
      ) {
        res.status(400).json({
          message:
            "Transaction already accepted",
        });

        return;
      }

      const updated =
        await prisma.transactions.update({
          where: { id },

          data: {
            status:
              TransactionStatus.ACCEPTED,
          },
        });

      res.status(200).json({
        message:
          "Transaction accepted",

        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

//////////////////////////////////////////////////
// ✅ REJECT TRANSACTION
//////////////////////////////////////////////////
export const rejectTransaction =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);

      const user = (req as any).user;

      // ✅ ORGANIZER ONLY
      if (
        !user ||
        user.role !== Role.ORGANIZER
      ) {
        res.status(403).json({
          message:
            "Only organizer can reject",
        });

        return;
      }

      const transaction =
        await prisma.transactions.findUnique({
          where: { id },

          include: {
            events: true,

            transaction_items: true,
          },
        });

      if (!transaction) {
        res.status(404).json({
          message:
            "Transaction not found",
        });

        return;
      }

      // ✅ OWNER CHECK
      if (
        transaction.events
          ?.organizer_id !== user.id
      ) {
        res.status(403).json({
          message: "Forbidden",
        });

        return;
      }

      // ✅ PREVENT DOUBLE REJECT
      if (
        transaction.status ===
        TransactionStatus.REJECTED
      ) {
        res.status(400).json({
          message:
            "Transaction already rejected",
        });

        return;
      }

      // ✅ RESTORE SOLD TICKET
      for (const item of transaction.transaction_items) {
        await prisma.tickets.update({
          where: {
            id:
              item.ticket_id || 0,
          },

          data: {
            sold: {
              decrement:
                item.quantity || 0,
            },
          },
        });
      }

      const updated =
        await prisma.transactions.update({
          where: { id },

          data: {
            status:
              TransactionStatus.REJECTED,
          },
        });

      res.status(200).json({
        message:
          "Transaction rejected",

        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

//////////////////////////////////////////////////
// ✅ UPLOAD PAYMENT PROOF
//////////////////////////////////////////////////
export const uploadPaymentProof =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);

      const user = (req as any).user;

      const transaction =
        await prisma.transactions.findUnique({
          where: { id },
        });

      if (!transaction) {
        res.status(404).json({
          message:
            "Transaction not found",
        });

        return;
      }

      // ✅ OWNER CHECK
      if (transaction.user_id !== user.id) {
        res.status(403).json({
          message: "Forbidden",
        });

        return;
      }

      // ✅ FILE CHECK
      if (!(req as any).file) {
        res.status(400).json({
          message:
            "Payment proof is required",
        });

        return;
      }

      // ✅ PREVENT UPLOAD AFTER FINAL STATUS
      if (
        transaction.status ===
          TransactionStatus.ACCEPTED ||
        transaction.status ===
          TransactionStatus.REJECTED
      ) {
        res.status(400).json({
          message:
            "Transaction already finalized",
        });

        return;
      }

      // ✅ PREVENT DOUBLE UPLOAD
      if (transaction.payment_proof) {
        res.status(400).json({
          message:
            "Payment proof already uploaded",
        });

        return;
      }

      // ✅ UPLOAD TO CLOUDINARY
      const imageurl =
        await uploadToCloudinary(
          (req as any).file,
          "payment-proofs"
        );

      // ✅ UPDATE TRANSACTION
      const updated =
        await prisma.transactions.update({
          where: { id },

          data: {
            payment_proof: imageurl,
          },
        });

      res.status(200).json({
        message:
          "Payment proof uploaded",

        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        message:
          error.message ||
          "Error uploading payment proof",
      });
    }
  };