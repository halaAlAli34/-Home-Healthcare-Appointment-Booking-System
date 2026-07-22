import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    return Response.json({
      success: true,
      message: "MongoDB Connected ✅",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Connection Failed ❌",
      },
      {
        status: 500,
      }
    );
  }
}