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
    // pool connection
    pool: {
      max: 10, // Maximum number of connections
      min: 0, // Minimum number of connections
      acquire: 30000, // Maximum time (ms) to acquire a connection
      idle: 10000, // Maximum idle time (ms) before releasing a connection
    },
    port: "3306",
    logging: console.log, // Logs all queries to the console
  },
);

async function checkIndexes() {
  console.log("CheckIndexes for mysql workbench. ");
  const [resultsEvent] = await sequelize.query("SHOW INDEX FROM Events;");
  const [resultsOrganization] = await sequelize.query(
    "SHOW INDEX FROM Organization;",
  );
  const [resultsUsers] = await sequelize.query("SHOW INDEX FROM Users;");
  const [resultsVenues] = await sequelize.query("SHOW INDEX FROM Venues;");
  // const [results] = await sequelize.query("SHOW INDEX FROM your_table_name;");
  console.log(resultsEvent);
  console.log(resultsOrganization);
  console.log(resultsUsers);
  console.log(resultsVenues);
}

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    // DO NOT REMOVE THIS COMMENT BELOW

    // THIS IS FOR logging of indexes for each table.
    // Currently this shows that the primary key is already index-ed
    // checkIndexes();
  })
  .catch((err) => console.log("Error: " + err));

module.exports = sequelize;
