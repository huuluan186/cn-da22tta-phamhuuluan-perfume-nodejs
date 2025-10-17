import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const host = process.env.DOCKER_DB_HOST || process.env.DB_HOST;
const port = process.env.DOCKER_DB_PORT || process.env.DB_PORT;

export default {
  development: {
    username: process.env.DOCKER_DB_USER || process.env.DB_USER,
    password: process.env.DOCKER_DB_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.DOCKER_DB_NAME || process.env.DB_NAME,
    host,
    port,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  }
};
