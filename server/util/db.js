import Sequelize from "sequelize";

const isTest = process.env.NODE_ENV === "test";

const sequelize = isTest
  ? new Sequelize("sqlite::memory:", { logging: false })
  : new Sequelize("messenger", "root", "qwerty", {
      dialect: "mysql",
      host: "localhost",
    });

export default sequelize;
