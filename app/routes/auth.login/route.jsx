import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { useState } from "react";
import { Form, useActionData, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const loader = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));

  return { errors };
};

export const action = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));

  return {
    errors,
  };
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;

  return (
    <AppProvider embedded={false}>
      <s-page heading="Welcome to Form Submission App">
        <s-section heading="Get Started">
          <s-card>
            <s-block-stack gap="400">
              <s-paragraph>
                Connect your Shopify store to start collecting form submissions from your customers.
              </s-paragraph>
              <s-heading size="small">Log in to your store</s-heading>
              <Form method="post">
                <s-block-stack gap="400">
                  <s-text-field
                    name="shop"
                    label="Shop domain"
                    details="Enter your shop domain (e.g., my-store.myshopify.com)"
                    value={shop}
                    onChange={(e) => setShop(e.currentTarget.value)}
                    autocomplete="on"
                    error={errors.shop}
                  />
                  <s-button-group>
                    <s-button type="submit" variant="primary">
                      Connect Store
                    </s-button>
                  </s-button-group>
                </s-block-stack>
              </Form>
            </s-block-stack>
          </s-card>
        </s-section>
      </s-page>
    </AppProvider>
  );
}
