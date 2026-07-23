import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";


export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

   const service = await Service.create({
  name: body.name,
  category: body.category,
  durationMinutes: body.durationMinutes,
  price: body.price,
  description: body.description,
  imageUrl: body.imageUrl ?? "",
});

    return NextResponse.json(
      {
        success: true,
        service: {
  id: service._id.toString(),
  name: service.name,
  category: service.category,
  durationMinutes: service.durationMinutes,
  price: service.price,
  description: service.description,
  imageUrl: service.imageUrl,
  active: service.active,
},
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST services error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create service.",
      },
      {
        status: 500,
      }
    );
  }
}


export async function GET() {
  try {
    await connectDB();

    const services = await Service.find({
  active: true,
})
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
    console.error("GET services error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch services.",
      },
      {
        status: 500,
      }
    );
  }
}