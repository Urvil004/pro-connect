import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    console.log("🔍 Frontend search API called with query:", query);
    console.log("📡 Backend URL:", API_BASE_URL);

    // Validate query length
    if (!query || query.trim().length < 2) {
      console.log("⚠️ Query too short, returning empty results");
      return NextResponse.json({
        users: [],
        posts: [],
        total: 0,
      });
    }

    const trimmedQuery = query.trim();
    let users = [];
    let posts = [];

    // Search users with better error handling
    try {
      const usersUrl = `${API_BASE_URL}/users/search?q=${encodeURIComponent(
        trimmedQuery
      )}`;
      console.log("👤 Searching users at:", usersUrl);

      const usersResponse = await fetch(usersUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      console.log("👤 Users response status:", usersResponse.status);

      if (usersResponse.ok) {
        const userData = await usersResponse.json();
        users = Array.isArray(userData) ? userData : userData.users || [];
        
        console.log("✅ Found users:", users.length);
        console.log("📋 User names:", users.map((u) => u.name || u._id).join(", "));
      } else {
        const errorText = await usersResponse.text();
        console.error("❌ Users search failed:", usersResponse.status, errorText);
      }
    } catch (error) {
      console.error("❌ Error searching users:", error.message);
      // Continue execution even if user search fails
    }

    // Search posts with better error handling
    try {
      const postsUrl = `${API_BASE_URL}/posts/search?q=${encodeURIComponent(
        trimmedQuery
      )}`;
      console.log("📝 Searching posts at:", postsUrl);

      const postsResponse = await fetch(postsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      console.log("📝 Posts response status:", postsResponse.status);

      if (postsResponse.ok) {
        const postData = await postsResponse.json();
        posts = Array.isArray(postData) ? postData : postData.posts || [];
        
        console.log("✅ Found posts:", posts.length);
      } else {
        const errorText = await postsResponse.text();
        console.error("❌ Posts search failed:", postsResponse.status, errorText);
      }
    } catch (error) {
      console.error("❌ Error searching posts:", error.message);
      // Continue execution even if post search fails
    }

    // Prepare final results
    const results = {
      users: users.slice(0, 10), // Increased from 5 to 10
      posts: posts.slice(0, 10), // Increased from 3 to 10
      total: users.length + posts.length,
    };

    console.log("✅ Final search results:", {
      userCount: results.users.length,
      postCount: results.posts.length,
      total: results.total,
      query: trimmedQuery,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("❌ Search API error:", error);
    return NextResponse.json(
      { 
        error: "Failed to perform search", 
        message: error.message,
        users: [], 
        posts: [], 
        total: 0 
      },
      { status: 500 }
    );
  }
}
