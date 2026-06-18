import { connectDB } from "@/lib/mongodb";
import Slide from "@/models/Slide";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET /api/slides?page=1&limit=8&search=growth&category=Strategy&sort=newest
// (Public) — anyone can browse and search slides, no login required.
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "newest";

    // Build the filter object piece by piece — only add a condition
    // if the user actually asked for it.
    const filter = {};

    if (search) {
      // $or = match if the search text is found in EITHER the title OR
      // the description. $options: "i" makes it case-insensitive.
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const totalSlides = await Slide.countDocuments(filter);

    const slides = await Slide.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      slides,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalSlides / limit)),
      totalSlides,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/slides  (Protected) — requires a valid JWT in the
// "Authorization: Bearer <token>" header.
export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to upload a slide." },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();

    if (!body.title || !body.description || !body.slideUrl) {
      return NextResponse.json(
        { error: "Title, description and slideUrl are required." },
        { status: 400 }
      );
    }

    const slide = await Slide.create({
      ...body,
      uploadedBy: user.userId,
    });

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
