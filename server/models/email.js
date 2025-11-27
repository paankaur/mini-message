import sequelize from "../util/db.js";
import Sequelize from "sequelize";

const Email = sequelize.define("Email", {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
  },
  receiverId: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: Sequelize.DataTypes.STRING(900),
    allowNull: false,
  },
  unread: {
    type: Sequelize.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

Email.associate = (models) => {
  if (models.User) {
    Email.belongsTo(models.User, { as: "sender", foreignKey: "senderId" });
    Email.belongsTo(models.User, { as: "receiver", foreignKey: "receiverId" });
  }
};

export default Email;
