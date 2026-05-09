const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }
);

const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB Connected successfully");
  } catch (error) {
    console.error("Unable to connect to DB:", error);
  }
};

module.exports = { sequelize, dbConnection };