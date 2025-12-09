import EmailRepository from "../repositories/email.js";
import UserRepository from "../repositories/user.js";

class EmailService {
  async createEmail(senderId, receiverId, message) {
    if (!senderId || !receiverId) {
      throw new Error("Sender and receiver are required.");
    }
    if (!message || message.length === 0) {
      throw new Error("Message cannot be empty.");
    }
    if (message.length > 900) {
      throw new Error("Message too long. Max 900 characters.");
    }

    const sender = await UserRepository.findById(senderId);
    if (!sender) {
      throw new Error("Sender not found.");
    }
    const receiver = await UserRepository.findById(receiverId);
    if (!receiver) {
      throw new Error("Receiver not found.");
    }

    return EmailRepository.create({ senderId, receiverId, message });
  }

  async getInbox(userId) {
    return EmailRepository.findByReceiverId(userId);
  }

  async getSent(userId) {
    return EmailRepository.findBySenderId(userId);
  }

  async markAsRead(emailId, userId) {
    const email = await EmailRepository.findById(emailId);
    if (!email) {
      throw new Error("Email not found.");
    }
    if (email.receiverId !== userId) {
      throw new Error("Not authorized.");
    }
    if (!email.unread) return email;
    return EmailRepository.markAsRead(emailId);
  }

  async getEmail(emailId) {
    return EmailRepository.findById(emailId);
  }

  async deleteEmail(emailId, userId) {
    const email = await EmailRepository.findById(emailId);
    if (!email) {
      throw new Error("Email not found.");
    }
    if (email.receiverId !== userId) {
      throw new Error("Not authorized.");
    }
    return EmailRepository.deleteEmail(emailId);
  }
}

export default new EmailService();
