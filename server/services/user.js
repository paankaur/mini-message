import UserRepository from "../repositories/user.js";

class UserService {
  async registerUser(name, password) {
    if (!name || name.length < 3) {
      throw new Error("Name must be at least 3 characters long.");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }
    const existingUser = await UserRepository.findByName(name);
    if (existingUser) {
      throw new Error("User with this name already exists.");
    }
    return UserRepository.create({ name, password });
  }

  async loginUser(name, password) {
    const user = await UserRepository.findByName(name);
    if (!user) {
      return null;
    }
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}

export default new UserService();
