import { connectDB } from "@/lib/mongodb";
import Slide from "@/models/Slide";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET /api/slides/:id  (Public)
export async function GET(request, { params }) {
  try {
    await connectDB();
    const slide = await Slide.findById(params.id);
    if (!slide) {
      return NextResponse.json({ error: "Slide not found." }, { status: 404 });
    }
    return NextResponse.json(slide);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/slides/:id  (Protected)
export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const updatedSlide = await Slide.findByIdAndUpdate(params.id, body, {
      new: true, // return the updated document, not the old one
    });

    if (!updatedSlide) {
      return NextResponse.json({ error: "Slide not found." }, { status: 404 });
    }

    return NextResponse.json(updatedSlide);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/slides/:id  (Protected)
export async function DELETE(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const deletedSlide = await Slide.findByIdAndDelete(params.id);

    if (!deletedSlide) {
      return NextResponse.json({ error: "Slide not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Slide deleted successfully." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
