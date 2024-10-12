const { Sequelize } = require("sequelize");

// Database connection setup
const sequelize = new Sequelize(
  //db name
  "inf2003db",
  //username
  "root",
  // password
  "13Eddie07",
  {
    host: "127.0.0.1",
    dialect: "mysql",
    port: "3306",
  },
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

module.exports = sequelize;
