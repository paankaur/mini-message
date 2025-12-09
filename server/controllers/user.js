import UserService from "../services/user.js";

class UserController {
  async register(req, res) {
    try {
      const { name, password } = req.body;
      const newUser = await UserService.registerUser(name, password);
      res.status(200).json({
        message: "User registered successfully",
        user: { id: newUser.id, name: newUser.name },
      });
    } catch (error) {
      if (error.message.includes("already exists")) {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: "Registration failed", error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { name, password } = req.body;
      const user = await UserService.loginUser(name, password);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      res.status(200).json({ message: "Login successful", user: { id: user.id, name: user.name } });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error: error.message });
    }
  }

  async changePassword(req, res) {
    try {
      const { userId, oldPassword, newPassword } = req.body;
      await UserService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      if (error.message === "User not found.") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message || "Password change failed" });
    }
  }

  async getUserByName(req, res) {
    try {
      const { name } = req.params;
      const user = await UserService.getUserByName(name);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json({ user: { id: user.id, name: user.name } });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error: error.message });
    }
  }
}

export default new UserController();
