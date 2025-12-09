import UserService from "../../services/user.js";
import UserRepository from "../../repositories/user.js";

jest.mock("../../repositories/user.js", () => ({
  findByName: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
}));

describe("UserService.registerUser", () => {
  const validName = "TestName";
  const validPassword = "securepassword";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should be a function", () => {
    expect(typeof UserService.registerUser).toBe("function");
  });

  test("should register a user when name is available", async () => {
    UserRepository.findByName.mockResolvedValue(null);
    UserRepository.create.mockResolvedValue({ id: 1, name: validName });

    const result = await UserService.registerUser(validName, validPassword);

    expect(UserRepository.findByName).toHaveBeenCalledWith(validName);
    expect(UserRepository.create).toHaveBeenCalledWith({
      name: validName,
      password: validPassword,
    });
    expect(result).toEqual({ id: 1, name: validName });
  });

  test("should throw error if name is too short", async () => {
    await expect(UserService.registerUser("ab", validPassword)).rejects.toThrow(
      "Name must be at least 3 characters long."
    );
  });

  test("should throw error if password is too short", async () => {
    await expect(UserService.registerUser(validName, "12345")).rejects.toThrow(
      "Password must be at least 6 characters long."
    );
  });

  test("should throw error if user already exists", async () => {
    UserRepository.findByName.mockResolvedValue({ id: 1, name: validName });

    await expect(UserService.registerUser(validName, validPassword)).rejects.toThrow(
      "User with this name already exists."
    );
  });
});

describe("UserService.loginUser", () => {
  const validName = "TestName";
  const validPassword = "securepassword";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should be a function", () => {
    expect(typeof UserService.loginUser).toBe("function");
  });

  test("should return user when credentials are correct", async () => {
    const mockUser = {
      id: 1,
      name: validName,
      isValidPassword: jest.fn().mockResolvedValue(true),
    };

    UserRepository.findByName.mockResolvedValue(mockUser);

    const result = await UserService.loginUser(validName, validPassword);

    expect(UserRepository.findByName).toHaveBeenCalledWith(validName);
    expect(mockUser.isValidPassword).toHaveBeenCalledWith(validPassword);
    expect(result).toBe(mockUser);
  });

  test("should return null if user does not exist", async () => {
    UserRepository.findByName.mockResolvedValue(null);

    const result = await UserService.loginUser(validName, validPassword);

    expect(result).toBeNull();
    expect(UserRepository.findByName).toHaveBeenCalledWith(validName);
  });

  test("should return null if password is incorrect", async () => {
    const mockUser = {
      id: 1,
      name: validName,
      isValidPassword: jest.fn().mockResolvedValue(false),
    };

    UserRepository.findByName.mockResolvedValue(mockUser);

    const result = await UserService.loginUser(validName, "wrongpassword");

    expect(result).toBeNull();
    expect(mockUser.isValidPassword).toHaveBeenCalledWith("wrongpassword");
  });
});

describe("UserService.changePassword", () => {
  const userId = 1;
  const oldPassword = "oldpassword";
  const newPassword = "newpassword";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should throw error if user is not found", async () => {
    UserRepository.findById.mockResolvedValue(null);

    await expect(UserService.changePassword(userId, oldPassword, newPassword)).rejects.toThrow(
      "User not found."
    );
  });

  test("should throw error if old password is incorrect", async () => {
    const mockUser = {
      id: userId,
      isValidPassword: jest.fn().mockResolvedValue(false),
    };
    UserRepository.findById.mockResolvedValue(mockUser);

    await expect(UserService.changePassword(userId, oldPassword, newPassword)).rejects.toThrow(
      "Old password is incorrect."
    );
  });

  test("should throw error if new password is too short", async () => {
    const mockUser = {
      id: userId,
      isValidPassword: jest.fn().mockResolvedValue(true),
    };
    UserRepository.findById.mockResolvedValue(mockUser);

    await expect(UserService.changePassword(userId, oldPassword, "123")).rejects.toThrow(
      "New password must be at least 6 characters long."
    );
  });

  test("should update password and save user successfully", async () => {
    const mockSave = jest.fn().mockResolvedValue(true);
    const mockUser = {
      id: userId,
      isValidPassword: jest.fn().mockResolvedValue(true),
      save: mockSave,
    };
    UserRepository.findById.mockResolvedValue(mockUser);

    const result = await UserService.changePassword(userId, oldPassword, newPassword);

    expect(mockUser.password).toBe(newPassword);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
