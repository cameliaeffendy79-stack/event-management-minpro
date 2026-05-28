import express from "express";
import {
  createTransaction,
  uploadPaymentProof,
} from "../controllers/transactionController";

const router = express.Router();

router.post("/", createTransaction);
router.patch("/:id/payment-proof", uploadPaymentProof);

export default router;