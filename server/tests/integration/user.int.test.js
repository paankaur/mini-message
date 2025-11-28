import UserController from "../../controllers/user.js";
import UserService from "../../services/user.js";

jest.mock("../../services/user.js");

describe("UserController Tests", () => {
  let req, res;

  const requestBody = { name: "testuser", password: "password123" };
  const serviceReturnValue = { id: 1, name: "testuser" };

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    const successfulResponse = {
      message: "User registered successfully",
      user: serviceReturnValue,
    };

    test("should register a user successfully and return 200", async () => {
      req.body = requestBody;
      UserService.registerUser.mockResolvedValue(serviceReturnValue);
      await UserController.register(req, res);

      expect(UserService.registerUser).toHaveBeenCalledWith(
        requestBody.name,
        requestBody.password
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successfulResponse);
    });

    test("should return 409 if user already exists (Conflict)", async () => {
      req.body = requestBody;
      const errorMessage = "User with this name already exists.";
      
      UserService.registerUser.mockRejectedValue(new Error(errorMessage));

      await UserController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: errorMessage,
      });
    });

    test("should return 500 on generic registration errors", async () => {
      req.body = requestBody;
      const internalError = new Error("Database connection failed");
      UserService.registerUser.mockRejectedValue(internalError);

      await UserController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Registration failed",
        error: internalError.message,
      });
    });
  });



  describe("login", () => {
    test("should log in user successfully and return 200", async () => {
      req.body = requestBody;
      UserService.loginUser.mockResolvedValue(serviceReturnValue);
      await UserController.login(req, res);

      expect(UserService.loginUser).toHaveBeenCalledWith(
        requestBody.name,
        requestBody.password
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        user: serviceReturnValue,
      });
    });

    test("should return 401 for invalid credentials", async () => {
      req.body = requestBody;

      UserService.loginUser.mockResolvedValue(null); 
      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid credentials.",
      });
    });

    test("should return 500 on login error", async () => {
      req.body = requestBody;
      const internalError = new Error("Auth service failure");
      UserService.loginUser.mockRejectedValue(internalError);
      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login failed",
        error: internalError.message,
      });
    });
  });

  

  describe("changePassword", () => {
    const changePasswordBody = {
      userId: 1,
      oldPassword: "oldpassword",
      newPassword: "newpassword",
    };

    test("should change password successfully and return 200", async () => {
      req.body = changePasswordBody;

      UserService.changePassword.mockResolvedValue(); 
      await UserController.changePassword(req, res);

      expect(UserService.changePassword).toHaveBeenCalledWith(
        changePasswordBody.userId,
        changePasswordBody.oldPassword,
        changePasswordBody.newPassword
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Password changed successfully",
      });
    });

    test("should return 404 for User not found", async () => {
      req.body = changePasswordBody;
      const errorMessage = "User not found.";
      UserService.changePassword.mockRejectedValue(new Error(errorMessage));
      await UserController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: errorMessage,
      });
    });

    test("should return 404 for Incorrect old password", async () => {
      req.body = changePasswordBody;
      const errorMessage = "Old password is incorrect.";
      UserService.changePassword.mockRejectedValue(new Error(errorMessage));
      await UserController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: errorMessage,
      });
    });

    test("should return 400 on other password change errors", async () => {
      req.body = changePasswordBody;
      const internalError = new Error("New password too short");
      UserService.changePassword.mockRejectedValue(internalError);
      await UserController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Password change failed",
        error: internalError.message,
      });
    });
  });
});