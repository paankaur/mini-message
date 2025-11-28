import Email from "../models/email.js";

class EmailRepository {
  async create(emailData) {
    return Email.create(emailData);
  }

  async findById(id) {
    return Email.findByPk(id);
  }

  async findByReceiverId(receiverId) {
    return Email.findAll({ where: { receiverId }, order: [["createdAt", "DESC"]] });
  }

  async findBySenderId(senderId) {
    return Email.findAll({ where: { senderId }, order: [["createdAt", "DESC"]] });
  }

  async markAsRead(id) {
    const email = await this.findById(id);
    if (!email) return null;
    email.unread = false;
    return email.save();
  }
}

export default new EmailRepository();
