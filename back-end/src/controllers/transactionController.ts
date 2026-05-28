import { Request, Response } from "express";
import prisma from "../config/prisma";
import { createTransactionService } from "../services/transaction.service";

/* CREATE TRANSACTION */
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { ticket_id, quantity } = req.body;

    if (!ticket_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: "ticket_id and quantity are required",
      });
    }

    const result = await createTransactionService(req.body);

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("🔥 TRANSACTION ERROR:", error);

    const clientErrors = [
      "Invalid input",
      "Ticket not found",
      "Not enough seats",
      "Voucher not found",
      "Voucher expired",
      "Voucher quota exceeded",
    ];

    if (clientErrors.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Transaction failed",
    });
  }
};

/* UPLOAD PAYMENT PROOF */
export const uploadPaymentProof = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { payment_proof } = req.body;

    if (!payment_proof) {
      return res.status(400).json({
        success: false,
        message: "Payment proof is required",
      });
    }

    const transaction = await prisma.transactions.update({
      where: { id },
      data: {
        payment_proof,
        status: "WAITING_CONFIRMATION",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Payment proof uploaded",
      data: transaction,
    });
  } catch (error) {
    console.error("🔥 PAYMENT PROOF ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload payment proof",
    });
  }
};