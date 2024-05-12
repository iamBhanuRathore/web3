// Extend the Request interface to include the userId property
import express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Define the userId property
    }
  }
}
