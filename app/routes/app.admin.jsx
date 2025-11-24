import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
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

    console.log("Loaded submissions:", submissions.length);
    return { submissions: submissions || [] };
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return { 
      submissions: [], 
      error: `Failed to fetch submissions: ${error.message || "Unknown error"}` 
    };
  }
}

export async function action() {
  // No action needed for this page
  return null;
}

export default function AdminPage() {
  const loaderData = useLoaderData();
  const submissions = loaderData?.submissions || [];
  const error = loaderData?.error;

  // Debug logging
  console.log("AdminPage render - submissions:", submissions.length, "error:", error);

  return (
    <s-page heading="Form Submissions">
      <s-section heading="Submissions">
        {error && (
          <s-banner status="critical" title="Error">
            {error}
          </s-banner>
        )}

        {!error && submissions.length === 0 ? (
          <s-card>
            <s-block-stack gap="400" align="center">
              <s-paragraph tone="subdued">
                No form submissions yet. Submit a form to see submissions here.
              </s-paragraph>
            </s-block-stack>
          </s-card>
        ) : !error && submissions.length > 0 ? (
          <s-card>
            <s-block-stack gap="400">
              <s-heading size="medium">All Submissions ({submissions.length})</s-heading>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e1e3e5" }}>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Name</th>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Email</th>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Phone Number</th>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Shop</th>
                      <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Submission Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s) => (
                      <tr key={s.id} style={{ borderBottom: "1px solid #e1e3e5" }}>
                        <td style={{ padding: "12px" }}>{s.name}</td>
                        <td style={{ padding: "12px" }}>{s.email}</td>
                        <td style={{ padding: "12px" }}>{s.phone}</td>
                        <td style={{ padding: "12px", color: "#6d7175" }}>
                          {s.shop || "N/A"}
                        </td>
                        <td style={{ padding: "12px" }}>
                          {new Date(s.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </s-block-stack>
          </s-card>
        ) : (
          <s-card>
            <s-block-stack gap="400" align="center">
              <s-paragraph>Loading...</s-paragraph>
            </s-block-stack>
          </s-card>
        )}
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);
