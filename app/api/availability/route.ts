import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Service from "@/models/Service";
import { getCaregiverById } from "@/lib/caregivers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
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

function intervalsOverlap(
  firstStart: number,
  firstEnd: number,
  secondStart: number,
  secondEnd: number,
): boolean {
  /*
   * Inclusive comparison is intentional.
   *
   * If an appointment finishes at 09:30, the 09:30 slot
   * is also displayed as unavailable.
   */
  return firstStart <= secondEnd && firstEnd >= secondStart;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const serviceId =
      request.nextUrl.searchParams.get("serviceId");

    const caregiverId =
      request.nextUrl.searchParams.get("caregiverId");

    const date = request.nextUrl.searchParams.get("date");

    if (!serviceId || !caregiverId || !date) {
      return NextResponse.json(
        {
          message:
            "Service, caregiver, and date are required.",
          unavailableSlots: [],
        },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return NextResponse.json(
        {
          message: "The selected service ID is invalid.",
          unavailableSlots: [],
        },
        { status: 400 },
      );
    }

    if (!isValidDate(date)) {
      return NextResponse.json(
        {
          message: "The selected date is invalid.",
          unavailableSlots: [],
        },
        { status: 400 },
      );
    }

    const caregiver = getCaregiverById(caregiverId);

    if (!caregiver) {
      return NextResponse.json(
        {
          message: "The selected caregiver was not found.",
          unavailableSlots: [],
        },
        { status: 404 },
      );
    }

    const service = await Service.findById(serviceId).lean();

    if (!service) {
      return NextResponse.json(
        {
          message: "The selected service was not found.",
          unavailableSlots: [],
        },
        { status: 404 },
      );
    }

    const serviceData = service as unknown as {
      name?: string;
      active?: boolean;
      durationMinutes?: number;
      duration?: number;
    };

    if (serviceData.active === false) {
      return NextResponse.json(
        {
          message: "The selected service is inactive.",
          unavailableSlots: [],
        },
        { status: 400 },
      );
    }

    const durationMinutes = Number(
      serviceData.durationMinutes ??
        serviceData.duration ??
        30,
    );

    if (
      !Number.isFinite(durationMinutes) ||
      durationMinutes <= 0
    ) {
      return NextResponse.json(
        {
          message:
            "The selected service has an invalid duration.",
          unavailableSlots: [],
        },
        { status: 400 },
      );
    }

    const appointments = await Appointment.find({
      caregiverId,
      date,
      status: {
        $in: ["pending", "accepted"],
      },
    })
      .select("startTime endTime durationMinutes")
      .lean();

    const unavailableSlots = TIME_SLOTS.filter((slot) => {
      const candidateStart = timeToMinutes(slot);
      const candidateEnd =
        candidateStart + durationMinutes;

      /*
       * Do not allow an appointment to finish after the
       * final working time.
       */
      const workDayEnd = timeToMinutes("18:00");

      if (candidateEnd > workDayEnd) {
        return true;
      }

      return appointments.some((appointment) => {
        const appointmentData =
          appointment as unknown as {
            startTime: string;
            endTime?: string;
            durationMinutes?: number;
          };

        const existingStart = timeToMinutes(
          appointmentData.startTime,
        );

        const existingDuration = Number(
          appointmentData.durationMinutes ?? 30,
        );

        const existingEnd = appointmentData.endTime
          ? timeToMinutes(appointmentData.endTime)
          : existingStart + existingDuration;

        return intervalsOverlap(
          candidateStart,
          candidateEnd,
          existingStart,
          existingEnd,
        );
      });
    });

    /*
     * These are the visual occupied blocks.
     *
     * Example:
     * 08:00 to 09:30 becomes:
     * 08:00, 08:30, 09:00, 09:30
     */
    const occupiedSlots = new Set<string>();

    appointments.forEach((appointment) => {
      const appointmentData =
        appointment as unknown as {
          startTime: string;
          endTime?: string;
          durationMinutes?: number;
        };

      const startMinutes = timeToMinutes(
        appointmentData.startTime,
      );

      const duration = Number(
        appointmentData.durationMinutes ?? 30,
      );

      const endMinutes = appointmentData.endTime
        ? timeToMinutes(appointmentData.endTime)
        : startMinutes + duration;

      for (
        let current = startMinutes;
        current <= endMinutes;
        current += 30
      ) {
        const slot = minutesToTime(current);

        if (TIME_SLOTS.includes(slot)) {
          occupiedSlots.add(slot);
        }
      }
    });

    return NextResponse.json(
      {
        message: "Availability loaded successfully.",
        serviceId,
        caregiverId,
        date,
        durationMinutes,
        unavailableSlots,
        occupiedSlots: Array.from(occupiedSlots),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/availability error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to load availability.",
        unavailableSlots: [],
        occupiedSlots: [],
      },
      { status: 500 },
    );
  }
}