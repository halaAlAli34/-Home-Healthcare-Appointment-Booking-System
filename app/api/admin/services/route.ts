import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET() {
  try {
    await connectDB();

    const services = await Service.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      services: services.map((service) => ({
        id: service._id.toString(),
        name: service.name,
        category: service.category,
        durationMinutes: service.durationMinutes,
        price: service.price,
        description: service.description,
        imageUrl: service.imageUrl ?? "",
        active: service.active,
      })),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch admin services.",
      },
      { status: 500 }
    );
  }
}