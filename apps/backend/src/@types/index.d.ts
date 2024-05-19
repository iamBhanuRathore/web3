// src/@types/index.d.ts
import { User, Balance, Worker } from "@prisma/client";
import express from "express";

declare global {
  namespace Express {
    interface Request {
      user: User;
      worker: Worker & {
        Balance: Balance?;
      };
    }
  }
}
