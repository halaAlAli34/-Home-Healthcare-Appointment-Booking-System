import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import Appointment from "@/models/Appointment";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body = await request.json();

    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        name: body.name,
        category: body.category,
        durationMinutes: body.durationMinutes,
        price: body.price,
        description: body.description,
        imageUrl: body.imageUrl ?? "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedService) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      service: {
        id: updatedService._id.toString(),
        name: updatedService.name,
        category: updatedService.category,
        durationMinutes: updatedService.durationMinutes,
        price: updatedService.price,
        description: updatedService.description,
        imageUrl: updatedService.imageUrl ?? "",
      },
    });

  } catch (error) {
    console.error("PUT service error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update service.",
      },
      {
        status: 500,
      }
    );
  }
}



export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    if (body.active === false) {
  await Appointment.updateMany(
    {
      serviceId: params.id,
      status: {
        $in: ["pending", "accepted"],
      },
    },
    {
      status: "cancelled",
    }
  );
}

    const service = await Service.findByIdAndUpdate(
      params.id,
      {
        active: body.active,
      },
      {
        new: true,
      }
    );

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      service,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update service.",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const deletedService = await Service.findById(id);

    if (!deletedService) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found.",
        },
        {
          status: 404,
        }
      );
    }

    await Appointment.updateMany(
  {
    serviceId: id,
    status: {
      $in: ["pending", "accepted"],
    },
  },
  {
    status: "cancelled",
  }
);

const deleted = await Service.findByIdAndDelete(id);

    return NextResponse.json({
  success: true,
  message: "Service deleted successfully. Related appointments were cancelled.",
});

  } catch (error) {
    console.error("DELETE service error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete service.",
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

    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      service: {
        id: service._id.toString(),
        name: service.name,
        category: service.category,
        price: service.price,
        durationMinutes: service.durationMinutes,
        description: service.description,
        imageUrl: service.imageUrl ?? "",
      },
    });

  } catch (error) {
    console.error("GET service error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch service.",
      },
      {
        status: 500,
      }
    );
  }
}