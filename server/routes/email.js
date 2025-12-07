import express from "express";
import EmailController from "../controllers/email.js";

const router = express.Router();

router.post("/", EmailController.create);
router.get("/inbox/:userId", EmailController.inbox);
router.get("/sent/:userId", EmailController.sent);
router.put("/:id/read", EmailController.markRead);
router.delete("/:id", EmailController.deleteEmail);
router.get("/:id", EmailController.getEmail);

export default router;
