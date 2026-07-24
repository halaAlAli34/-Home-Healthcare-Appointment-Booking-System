import express from "express";
import {
  acceptAppointment,
  rejectAppointment,
  getDashboardStats
} from "../controllers/adminController";

const router = express.Router();


router.patch(
  "/appointments/:id/accept",
  acceptAppointment
);


router.patch(
  "/appointments/:id/reject",
  rejectAppointment
);


router.get(
  "/dashboard",
  getDashboardStats
);


export default router;