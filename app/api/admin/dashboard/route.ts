import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import Appointment from "@/models/Appointment";


export async function GET() {
  try {
    await connectDB();

    const pendingAppointments =
      await Appointment.countDocuments({
        status: "pending",
      });


    const activeServices =
      await Service.countDocuments({
        active: true,
      });


    const today =
      new Date().toISOString().split("T")[0];


    const todaysVisits =
      await Appointment.countDocuments({
        date: today,
        status: "accepted",
      });

      const now = new Date();

const startOfMonth = new Date(
  now.getFullYear(),
  now.getMonth(),
  1
);

const startOfNextMonth = new Date(
  now.getFullYear(),
  now.getMonth() + 1,
  1
);

const revenueResult = await Appointment.aggregate([
  {
    $match: {
      status: "accepted",
      createdAt: {
        $gte: startOfMonth,
        $lt: startOfNextMonth,
      },
    },
  },
  {
    $group: {
      _id: null,
      total: {
        $sum: "$servicePrice",
      },
    },
  },
]);

const revenueThisMonth =
  revenueResult[0]?.total || 0;


    return NextResponse.json({
      pendingAppointments,
      todaysVisits,
      activeServices,
      revenueThisMonth,
    });

  } catch (error) {

    return NextResponse.json(
      {
        message: "Failed to get dashboard stats",
      },
      {
        status: 500,
      }
    );

  }
}