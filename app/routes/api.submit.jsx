import prisma from "../db.server";

export async function action({ request }) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");

    // Validate required fields
    if (!name || !email || !phone) {
      return Response.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Get shop from form data if available (for embedded app submissions)
    const shop = formData.get("shop");

    // Save to database
    const submission = await prisma.form.create({
      data: {
        name: name.toString(),
        email: email.toString(),
        phone: phone.toString(),
        shop: shop ? shop.toString() : null,
      },
    });

    return Response.json({ success: true, id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("Error saving form submission:", error);
    return Response.json(
      { error: "Failed to save submission" },
      { status: 500 }
    );
  }
}

