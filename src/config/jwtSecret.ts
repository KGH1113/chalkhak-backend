import dotenv from "dotenv";

dotenv.config();

export function getJwtSecret() {
  const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
  if (JWT_SECRET == "default_secret") {
    console.warn(
      `Using JWT_SECRET value as "default_secret". Please check the environment variable.`
    );
  }
  return JWT_SECRET;
}
