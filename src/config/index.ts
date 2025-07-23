import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

function getEnv(key: string, required = true): string {
  const value = process.env[key];
  if (required && (value === undefined || value === "")) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value!;
}

const config = {
  environment:
    getEnv("npm_lifecycle_event") === "dev"
      ? "development"
      : getEnv("npm_lifecycle_event") === "start"
        ? "production"
        : "test",
  port: getEnv("PORT"),
  database: {
    user: getEnv("DB_USER"),
    password: getEnv("DB_PASSWORD"),
    host: getEnv("DB_HOST"),
    port: getEnv("DB_PORT"),
    name: getEnv("DB_NAME"),
    url: `postgresql://${getEnv("DB_USER")}:${getEnv("DB_PASSWORD")}@${getEnv("DB_HOST")}:${getEnv("DB_PORT")}/${getEnv("DB_NAME")}`,
  },
  secret: {
    jwt: getEnv("JWT_SECRET"),
    encryption: getEnv("ENCRYPTION_SECRET"),
  },
  smtp: {
    host: getEnv("SMTP_HOST", false),
    port: getEnv("SMTP_PORT", false),
    user: getEnv("SMTP_USER", false),
    password: getEnv("SMTP_PASSWORD", false),
  },
};

export default config;
