import EmailService from "../services/email.js";
import { getIo } from "../util/socket.js";

class EmailController {
  async create(req, res) {
    try {
      const { senderId, receiverId, message } = req.body;
      const email = await EmailService.createEmail(senderId, receiverId, message);
      try {
        const io = getIo();
        io.to(`user_${receiverId}`).emit("new_email", {
          id: email.id,
          senderId: email.senderId,
          receiverId: email.receiverId,
          unread: email.unread,
        });
      } catch (e) {}
      res.status(200).json({
        message: "Email sent successfully",
        email: {
          id: email.id,
          senderId: email.senderId,
          receiverId: email.receiverId,
          unread: email.unread,
        },
      });
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: "Failed to send email", error: error.message });
    }
  }

  async inbox(req, res) {
    try {
      const { userId } = req.params;
      const emails = await EmailService.getInbox(Number(userId));
      res.status(200).json({ emails });
    } catch (error) {
      res.status(500).json({ message: "Failed to load inbox", error: error.message });
    }
  }

  async sent(req, res) {
    try {
      const { userId } = req.params;
      const emails = await EmailService.getSent(Number(userId));
      res.status(200).json({ emails });
    } catch (error) {
      res.status(500).json({ message: "Failed to load sent items", error: error.message });
    }
  }

  async markRead(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      await EmailService.markAsRead(Number(id), userId);
      res.status(200).json({ message: "Marked as read" });
    } catch (error) {
      if (error.message === "Email not found.") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Not authorized.") {
        return res.status(403).json({ message: error.message });
      }
      res.status(400).json({ message: "Failed to mark as read", error: error.message });
    }
  }

  async getEmail(req, res) {
    try {
      const { id } = req.params;
      const email = await EmailService.getEmail(Number(id));
      if (!email) {
        return res.status(404).json({ message: "Email not found." });
      }
      res.status(200).json({ email });
    } catch (error) {
      res.status(500).json({ message: "Failed to load email", error: error.message });
    }
  }

  async deleteEmail(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      await EmailService.deleteEmail(Number(id), userId);
      res.status(200).json({ message: "Email deleted" });
    } catch (error) {
      if (error.message === "Email not found.") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Not authorized.") {
        return res.status(403).json({ message: error.message });
      }
      res.status(400).json({ message: "Failed to delete email", error: error.message });
    }
  }
}

export default new EmailController();
