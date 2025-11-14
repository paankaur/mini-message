import sequelize from "../util/db.js";
import Sequelize from "sequelize";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
      },
    },
  }
);

User.prototype.isValidPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default User;
