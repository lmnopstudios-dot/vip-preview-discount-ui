import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    mutation {
      discountAutomaticAppCreate(
        automaticAppDiscount: {
          title: "VIP TEST"
          functionHandle: "discount-function"
          discountClasses: [PRODUCT]
          startsAt: "2026-04-30T00:00:00Z"
        }
      ) {
        automaticAppDiscount {
          discountId
        }
        userErrors {
          field
          message
        }
      }
    }
  `);

  return json(await response.json());
};

export default function Index() {
  const fetcher = useFetcher();

  return (
    <div style={{ padding: 20 }}>
      <h1>Create VIP Discount</h1>

      <fetcher.Form method="post">
        <button type="submit">Create Discount</button>
      </fetcher.Form>

      {fetcher.data && (
        <pre>{JSON.stringify(fetcher.data, null, 2)}</pre>
      )}
    </div>
  );
}