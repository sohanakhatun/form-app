import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  return (
    <s-page heading="Welcome 🎉">
      <s-card>
        <s-block-stack gap="400">
          <s-heading>Welcome to the Form Collector App</s-heading>
          <s-paragraph tone="subdued">
            Use the navigation to submit a form or view all submissions.
          </s-paragraph>
        </s-block-stack>
      </s-card>
    </s-page>
  );
}

export const headers = (args) => boundary.headers(args);
