import { NextRequest, NextResponse } from "next/server";
import { mockAppointments } from "@/lib/appointment";

export async function GET() {
  return NextResponse.json({
    success: true,
    appointments: mockAppointments,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = [
      body.service,
      body.nurse,
      body.date,
      body.time,
    ];

    if (requiredFields.some((field) => !field)) {
      return NextResponse.json(
        {
          success: false,
          message: "Service, nurse, date, and time are required.",
        },
        {
          status: 400,
        }
      );
    }

    const appointment = {
      id: Date.now().toString(),
      client: "Omar Hammoud",
      service: body.service,
      nurse: body.nurse,
      date: body.date,
      time: body.time,
      notes: body.notes ?? "",
      status: "pending",
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
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body.",
      },
      {
        status: 400,
      }
    );
  }
}
