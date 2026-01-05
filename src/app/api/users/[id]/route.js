import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    console.log("🔍 Frontend API: Fetching user:", id);
    console.log("🔗 Backend URL:", `${API_BASE_URL}/users/${id}`);

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // ✅ Prevent caching issues
    });

    console.log("📡 Backend response status:", response.status);

    if (!response.ok) {
      console.error("❌ Backend responded with error:", response.status);
      
      const errorData = await response.json().catch(() => ({
        message: "User not found",
      }));
      
      return NextResponse.json(
        { message: errorData.message || "User not found" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ User data received:", data.name || data.email);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Get user error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    console.log("📝 Updating user:", id);
    console.log("🔗 Backend URL:", `${API_BASE_URL}/users/${id}`);

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("📡 Update response status:", response.status);

    if (!response.ok) {
      console.error("❌ Update failed:", response.status);
      
      const errorData = await response.json().catch(() => ({
        message: "Update failed",
      }));
      
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    console.log("✅ User updated successfully");
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Update user error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
