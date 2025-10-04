import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const sequelize = new Sequelize(
  process.env.DOCKER_DB_NAME || process.env.DB_NAME,
  process.env.DOCKER_DB_USER || process.env.DB_USER,
  process.env.DOCKER_DB_PASSWORD || process.env.DB_PASSWORD,
  {
    host: process.env.DOCKER_DB_HOST || process.env.DB_HOST,
    port: process.env.DOCKER_DB_PORT || process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Database connected via Sequelize!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export { sequelize };
export default connectDatabase;
