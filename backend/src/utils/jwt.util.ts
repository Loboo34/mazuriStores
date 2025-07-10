import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { config } from "../config/env.config";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

// Extend the default JWT payload to include our custom fields
interface ExtendedJwtPayload extends jwt.JwtPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

function assertString(value: any, name: string): asserts value is string {
  if (!value || typeof value !== "string") {
    throw new Error(`${name} is not defined in environment variables`);
  }
}

export const generateToken = (payload: JwtPayload): string => {
  assertString(config.JWT_SECRET, "JWT_SECRET");

  const options: SignOptions = {
    expiresIn: "7d",
    issuer: "mazuri-stores",
    audience: "mazuri-users",
  };

  return jwt.sign(payload, config.JWT_SECRET, options);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  assertString(config.JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET");

  const options: SignOptions = {
    expiresIn:"30d",
    issuer: "mazuri-stores",
    audience: "mazuri-users",
  };

  return jwt.sign(payload, config.JWT_REFRESH_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    assertString(config.JWT_SECRET, "JWT_SECRET");

    const options: VerifyOptions = {
      issuer: "mazuri-stores",
      audience: "mazuri-users",
    };

    const decoded = jwt.verify(
      token,
      config.JWT_SECRET,
      options
    ) as ExtendedJwtPayload;

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    assertString(config.JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET");

    const options: VerifyOptions = {
      issuer: "mazuri-stores",
      audience: "mazuri-users",
    };

    const decoded = jwt.verify(
      token,
      config.JWT_REFRESH_SECRET,
      options
    ) as ExtendedJwtPayload;

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  decodeToken,
};
