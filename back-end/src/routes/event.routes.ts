import { Router } from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);

router.post("/", authMiddleware, createEvent);
router.put("/:id", authMiddleware, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

export default router;