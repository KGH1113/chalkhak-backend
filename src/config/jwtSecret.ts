import dotenv from "dotenv";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "default_secret";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "default_secret";

export function getAccessTokenSecret() {
  if (accessTokenSecret === "default_secret") {
    console.warn(
      `Using ACCESS_TOKEN_SECRET value as "default_secret". Please check the environment variable.`
    );
  }
  return accessTokenSecret;
}

export function getRefreshTokenSecret() {
  if (refreshTokenSecret === "default_secret") {
    console.warn(
      `Using REFRESH_TOKEN_SECRET value as "default_secret". Please check the environment variable.`
    );
  }
  return refreshTokenSecret;
}
