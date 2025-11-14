import User from "../models/user.js";

class UserRepository {
  async findByName(name) {
    return User.findOne({ where: { name } });
  }

  async create(userData) {
    return User.create(userData);
  }
}

export default new UserRepository();
