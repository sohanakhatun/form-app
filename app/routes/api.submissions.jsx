import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function loader({ request }) {
  // Authenticate the merchant/admin
  await authenticate.admin(request);

  try {
    // Fetch all form submissions from database
    const submissions = await prisma.form.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return Response.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

