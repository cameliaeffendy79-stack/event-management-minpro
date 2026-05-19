import { Router } from "express";

import {
  createTransaction,
  getMyTransactions,
  getOrganizerTransactions,
  acceptTransaction,
  rejectTransaction,
  uploadPaymentProof,
} from "../controllers/transaction.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  createTransaction
);

router.get(
  "/my-transactions",
  authMiddleware,
  getMyTransactions
);

router.get(
  "/organizer",
  authMiddleware,
  getOrganizerTransactions
);

router.patch(
  "/:id/payment-proof",
  authMiddleware,
  upload.single("payment_proof"),
  uploadPaymentProof
);

router.patch(
  "/:id/accept",
  authMiddleware,
  acceptTransaction
);

router.patch(
  "/:id/reject",
  authMiddleware,
  rejectTransaction
);

export default router;