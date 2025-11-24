import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
}

export default function Index() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider embedded apiKey={apiKey}>
      <s-app-nav>
        <s-link href="/" rel="home">Home</s-link>
        <s-link href="/app/admin">View Submissions</s-link>
      </s-app-nav>
      <s-page heading="Welcome to Form Submission App">
        <s-section heading="Get Started">
          <s-card>
            <s-block-stack gap="400">
              <s-heading size="large">Welcome! 🎉</s-heading>
              <s-paragraph>
                Collect customer information through customizable forms and manage all submissions in one place.
              </s-paragraph>
            </s-block-stack>
          </s-card>
        </s-section>

        <s-section heading="Quick Actions">
          <s-block-stack gap="400">
            <s-card>
              <s-block-stack gap="400">
                <s-block-stack gap="200">
                  <s-heading size="medium">View Submissions</s-heading>
                  <s-paragraph tone="subdued">
                    See all form submissions from your storefront in one place.
                  </s-paragraph>
                </s-block-stack>
                <s-button-group>
                  <s-button href="/app/admin" variant="primary">
                    View Submissions
                  </s-button>
                </s-button-group>
              </s-block-stack>
            </s-card>

            <s-card>
              <s-block-stack gap="400">
                <s-block-stack gap="200">
                  <s-heading size="medium">Add Form to Storefront</s-heading>
                  <s-paragraph tone="subdued">
                    Add the contact form to your storefront using the App Block in Theme Customizer.
                  </s-paragraph>
                </s-block-stack>
                <s-paragraph tone="subdued" size="small">
                  Go to <strong>Online Store → Themes → Customize</strong> and add the "Contact Form" app block.
                </s-paragraph>
              </s-block-stack>
            </s-card>
          </s-block-stack>
        </s-section>

        <s-section heading="Features">
          <s-block-stack gap="300">
            <s-card>
              <s-block-stack gap="300">
                <s-heading size="small">Easy Form Creation</s-heading>
                <s-paragraph tone="subdued">
                  Add contact forms to your storefront with drag-and-drop app blocks - no code required.
                </s-paragraph>
              </s-block-stack>
            </s-card>
            <s-card>
              <s-block-stack gap="300">
                <s-heading size="small">Centralized Dashboard</s-heading>
                <s-paragraph tone="subdued">
                  View and manage all form submissions from your Shopify admin.
                </s-paragraph>
              </s-block-stack>
            </s-card>
            <s-card>
              <s-block-stack gap="300">
                <s-heading size="small">Fully Customizable</s-heading>
                <s-paragraph tone="subdued">
                  Customize form appearance, fields, and messages to match your brand.
                </s-paragraph>
              </s-block-stack>
            </s-card>
          </s-block-stack>
        </s-section>
      </s-page>
    </AppProvider>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);

