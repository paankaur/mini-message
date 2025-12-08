import Email from "../models/email.js";

class EmailRepository {
  async create(emailData) {
    return Email.create(emailData);
  }

  async findById(id) {
    return Email.findByPk(id, { include: { association: "sender" } });
  }

  async findByReceiverId(receiverId) {
    return Email.findAll({ 
      where: { receiverId }, 
      include: { association: "sender" },
      order: [["createdAt", "DESC"]] 
    });
  }

  async findBySenderId(senderId) {
    return Email.findAll({ 
      where: { senderId }, 
      include: { association: "sender" },
      order: [["createdAt", "DESC"]] 
    });
  }

  async markAsRead(id) {
    const email = await this.findById(id);
    if (!email) return null;
    email.unread = false;
    return email.save();
  }

  async deleteEmail(id) {
    return Email.destroy({ where: { id } });
  }
}

export default new EmailRepository();
