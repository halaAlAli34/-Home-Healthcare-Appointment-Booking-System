import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const allowedStatuses = [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
  "completed",
] as const;

type AppointmentStatus = (typeof allowedStatuses)[number];

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid appointment ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const status = body.status as AppointmentStatus;

    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Status must be pending, accepted, rejected, cancelled, or completed.",
        },
        {
          status: 400,
        }
      );
    }

    const currentAppointment = await Appointment.findById(id);

    if (!currentAppointment) {
      return NextResponse.json(
        {
          success: false,
          message: "Appointment not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      currentAppointment.status === "cancelled" ||
      currentAppointment.status === "rejected" ||
      currentAppointment.status === "completed"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `A ${currentAppointment.status} appointment cannot be updated.`,
        },
        {
          status: 400,
        }
      );
    }

    currentAppointment.status = status;

    await currentAppointment.save();

    const appointment = {
      id: currentAppointment._id.toString(),
      client: currentAppointment.patientName,
      service: currentAppointment.serviceName,
      nurse: currentAppointment.caregiver,
      date: currentAppointment.date,
      time: currentAppointment.time,
      address: currentAppointment.address,
      notes: currentAppointment.notes ?? "",
      status: currentAppointment.status,
    };

    return NextResponse.json({
      success: true,
      message: `Appointment ${status} successfully.`,
      appointment,
    });
  } catch (error) {
    console.error("PATCH appointment error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update appointment.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid appointment ID.",
        },
        {
          status: 400,
        }
      );
    }

    const databaseAppointment = await Appointment.findById(id).lean();

    if (!databaseAppointment) {
      return NextResponse.json(
        {
          success: false,
          message: "Appointment not found.",
        },
        {
          status: 404,
        }
      );
    }

    const appointment = {
      id: databaseAppointment._id.toString(),
      client: databaseAppointment.patientName,
      service: databaseAppointment.serviceName,
      nurse: databaseAppointment.caregiver,
      date: databaseAppointment.date,
      time: databaseAppointment.time,
      address: databaseAppointment.address,
      notes: databaseAppointment.notes ?? "",
      status: databaseAppointment.status,
    };

    return NextResponse.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error("GET appointment by ID error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch appointment.",
      },
      {
        status: 500,
      }
    );
  }
}