import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function GET() {
  try {
    await connectDB();

    const databaseAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .lean();

    const appointments = databaseAppointments.map((appointment) => ({
      id: appointment._id.toString(),
      client: appointment.patientName,
      service: appointment.serviceName,
      nurse: appointment.caregiver,
      date: appointment.date,
      time: appointment.time,
      address: appointment.address,
      notes: appointment.notes ?? "",
      status: appointment.status,
    }));

    return NextResponse.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("GET appointments error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch appointments.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const service = body.service?.trim();
    const nurse = body.nurse?.trim();
    const date = body.date?.trim();
    const time = body.time?.trim();
    const address = body.address?.trim();
    const patientName =
      body.patientName?.trim() ||
      body.client?.trim() ||
      "Omar Hammoud";

    if (!service || !nurse || !date || !time || !address) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Service, nurse, date, time, and address are required.",
        },
        {
          status: 400,
        }
      );
    }

    const existingAppointment = await Appointment.findOne({
      date,
      time,
    });

    if (existingAppointment) {
      return NextResponse.json(
        {
          success: false,
          message: "This date and time are already booked.",
        },
        {
          status: 409,
        }
      );
    }

    const createdAppointment = await Appointment.create({
      serviceName: service,
      patientName,
      caregiver: nurse,
      date,
      time,
      address,
      notes: body.notes?.trim() ?? "",
      status: "pending",
    });

    const appointment = {
      id: createdAppointment._id.toString(),
      client: createdAppointment.patientName,
      service: createdAppointment.serviceName,
      nurse: createdAppointment.caregiver,
      date: createdAppointment.date,
      time: createdAppointment.time,
      address: createdAppointment.address,
      notes: createdAppointment.notes,
      status: createdAppointment.status,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Appointment created successfully.",
        appointment,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST appointment error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create appointment.",
      },
      {
        status: 500,
      }
    );
  }
}