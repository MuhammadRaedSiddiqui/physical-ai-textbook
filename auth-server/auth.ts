import { betterAuth } from "better-auth";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
});

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      software_background: {
        type: "string",
        required: false,
      },
      hardware_background: {
        type: "string",
        required: false,
      },
    },
  },
  trustedOrigins: [process.env.ALLOWED_ORIGINS || "http://localhost:3000"],
});
