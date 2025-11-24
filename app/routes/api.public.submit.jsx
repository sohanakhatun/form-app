import prisma from "../db.server";

// CORS headers helper
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

// Handle OPTIONS preflight requests
export async function loader({ request }) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  return new Response(null, { status: 405 });
}

// Public API endpoint for storefront form submissions
// No authentication required, but includes CORS headers for cross-origin requests
export async function action({ request }) {
  // Handle CORS preflight (backup)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { 
        status: 405,
        headers: corsHeaders,
      }
    );
  }

  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const shop = formData.get("shop"); // Optional: shop domain for tracking

    // Validate required fields
    if (!name || !email || !phone) {
      return Response.json(
        { error: "Name, email, and phone are required" },
        { 
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toString())) {
      return Response.json(
        { error: "Invalid email format" },
        { 
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Save to database
    const submission = await prisma.form.create({
      data: {
        name: name.toString(),
        email: email.toString(),
        phone: phone.toString(),
        shop: shop ? shop.toString() : null,
      },
    });

    return Response.json(
      { success: true, id: submission.id },
      { 
        status: 201,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error saving form submission:", error);
    return Response.json(
      { error: "Failed to save submission" },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// Export headers function to ensure CORS headers are always set
export function headers() {
  return corsHeaders;
}

