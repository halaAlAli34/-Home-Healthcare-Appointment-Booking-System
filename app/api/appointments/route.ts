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
  role?: string;
}

interface AuthenticatedUser {
  userId: string;
  role: string;
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

function getAuthenticatedUser(
  request: NextRequest
): AuthenticatedUser | null {
  const token =
    request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as AuthenticationPayload;

    const userId = payload.userId || payload.id;

    if (!userId) {
      return null;
    }

    return {
      userId,
      role: payload.role?.toLowerCase() || "patient",
    };
  } catch {
    return null;
  }
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;
}

function isValidTime(time: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

/*
 * GET appointments
 *
 * Admin:
 * Returns all appointments.
 *
 * Patient:
 * Returns only their own appointments.
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authenticatedUser =
      getAuthenticatedUser(request);

    if (!authenticatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const isAdmin =
      authenticatedUser.role === "admin";

    const filter = isAdmin
      ? {}
      : {
          patientId: authenticatedUser.userId,
        };

    const appointments = await Appointment.find(filter)
      .populate("patientId", "name fullName email")
      .sort({
        date: 1,
        startTime: 1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load appointments.",
      },
      { status: 500 }
    );
  }
}

/*
 * POST appointment
 *
 * Creates an appointment for the authenticated patient.
 * Prevents caregiver time conflicts.
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authenticatedUser =
      getAuthenticatedUser(request);

    if (!authenticatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const patientId = authenticatedUser.userId;

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
          success: false,
          message:
            "Service, caregiver, date, time, address, and phone are required.",
        },
        { status: 400 }
      );
    }

    if (!isValidDate(date)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid appointment date.",
        },
        { status: 400 }
      );
    }

    if (!isValidTime(startTime)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid appointment time.",
        },
        { status: 400 }
      );
    }

    const selectedDate = new Date(
      `${date}T00:00:00`
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot book an appointment in the past.",
        },
        { status: 400 }
      );
    }

    const service = await Service.findById(
      serviceId
    ).lean();

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found.",
        },
        { status: 404 }
      );
    }

    if (service.active === false) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This service is currently unavailable.",
        },
        { status: 400 }
      );
    }

    const caregiver =
      getCaregiverById(caregiverId);

    if (!caregiver) {
      return NextResponse.json(
        {
          success: false,
          message: "Caregiver not found.",
        },
        { status: 404 }
      );
    }

    const durationMinutes =
  service.durationMinutes || 30;

    const startMinutes =
      timeToMinutes(startTime);

    const endMinutes =
      startMinutes + durationMinutes;

    if (endMinutes >= 24 * 60) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The appointment must end before midnight.",
        },
        { status: 400 }
      );
    }

    const endTime =
      minutesToTime(endMinutes);

    /*
     * Conflict rule:
     *
     * Existing appointment starts before the new one ends,
     * and existing appointment ends after the new one starts.
     */
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
          success: false,
          message:
            "This caregiver is unavailable during the selected time.",
        },
        { status: 409 }
      );
    }

    const appointment =
      await Appointment.create({
        patientId,
        serviceId: service._id,

        serviceName: service.name,
        servicePrice: service.price,

        caregiverId: caregiver.id,
        caregiverName: caregiver.name,
        caregiverRole: caregiver.role,
        caregiverSpecialty:
          caregiver.specialty,

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
        success: true,
        message:
          "Appointment booked successfully.",
        appointment,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(
      "Create appointment error:",
      error
    );

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An old database uniqueness rule blocked this appointment. Check the indexes in the appointments collection.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create appointment.",
      },
      { status: 500 }
    );
  }
}