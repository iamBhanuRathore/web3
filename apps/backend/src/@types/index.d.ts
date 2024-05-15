// src/@types/index.d.ts
import { User } from "@prisma/client";
import express from "express";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
