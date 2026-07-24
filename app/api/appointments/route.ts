import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Service from "@/models/Service";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { getCaregiverById } from "@/lib/caregivers";

export const runtime = "nodejs";

interface AuthenticationPayload extends JwtPayload {
  userId?: string;
  id?: string;
}

interface CreateAppointmentBody {
  serviceId?: string;
  caregiverId?: string;
  date?: string;
  startTime?: string;
  address?: string;
  phone?: string;
  notes?: string;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}`;
}

function isValidTime(time: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function getAuthenticatedUserId(
  request: NextRequest,
): string | null {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as AuthenticationPayload;

    return payload.userId || payload.id || null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const patientId = getAuthenticatedUserId(request);

    if (!patientId) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const appointments = await Appointment.find({
      patientId,
    })
      .sort({
        date: 1,
        startTime: 1,
      })
      .lean();

    return NextResponse.json({
      appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);

    return NextResponse.json(
      {
        message: "Failed to load appointments.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const patientId = getAuthenticatedUserId(request);

    if (!patientId) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const body =
      (await request.json()) as CreateAppointmentBody;

    const {
      serviceId,
      caregiverId,
      date,
      startTime,
      address,
      phone,
      notes,
    } = body;

    if (
      !serviceId ||
      !caregiverId ||
      !date ||
      !startTime ||
      !address ||
      !phone
    ) {
      return NextResponse.json(
        {
          message:
            "Service, caregiver, date, time, address, and phone are required.",
        },
        { status: 400 },
      );
    }

    if (!isValidDate(date)) {
      return NextResponse.json(
        {
          message: "Invalid appointment date.",
        },
        { status: 400 },
      );
    }

    if (!isValidTime(startTime)) {
      return NextResponse.json(
        {
          message: "Invalid appointment time.",
        },
        { status: 400 },
      );
    }

    const selectedDate = new Date(`${date}T00:00:00`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return NextResponse.json(
        {
          message: "You cannot book an appointment in the past.",
        },
        { status: 400 },
      );
    }

    const service = await Service.findById(serviceId).lean();

    if (!service) {
      return NextResponse.json(
        {
          message: "Service not found.",
        },
        { status: 404 },
      );
    }

    if (service.active === false) {
      return NextResponse.json(
        {
          message: "This service is currently unavailable.",
        },
        { status: 400 },
      );
    }

    const caregiver = getCaregiverById(caregiverId);

    if (!caregiver) {
      return NextResponse.json(
        {
          message: "Caregiver not found.",
        },
        { status: 404 },
      );
    }

    const durationMinutes =
      service.durationMinutes || service.duration || 30;

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + durationMinutes;

    if (endMinutes > 24 * 60) {
      return NextResponse.json(
        {
          message: "The appointment ends after midnight.",
        },
        { status: 400 },
      );
    }

    const endTime = minutesToTime(endMinutes);

    const conflictingAppointment =
      await Appointment.findOne({
        caregiverId,
        date,
        status: {
          $in: ["pending", "accepted"],
        },
        startTime: {
          $lt: endTime,
        },
        endTime: {
          $gt: startTime,
        },
      }).lean();

    if (conflictingAppointment) {
      return NextResponse.json(
        {
          message:
            "This caregiver is unavailable during the selected time.",
        },
        { status: 409 },
      );
    }

    const appointment = await Appointment.create({
      patientId,
      serviceId: service._id,

      serviceName: service.name,
      servicePrice: service.price,

      caregiverId: caregiver.id,
      caregiverName: caregiver.name,
      caregiverRole: caregiver.role,
      caregiverSpecialty: caregiver.specialty,

      date,
      startTime,
      endTime,
      durationMinutes,

      address: address.trim(),
      phone: phone.trim(),
      notes: notes?.trim() || "",

      status: "pending",
    });

    return NextResponse.json(
      {
        message: "Appointment booked successfully.",
        appointment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create appointment error:", error);

    return NextResponse.json(
      {
        message: "Failed to create appointment.",
      },
      { status: 500 },
    );
  }
}