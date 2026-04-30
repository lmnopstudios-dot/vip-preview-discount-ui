import { useFetcher } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
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

    return await response.json();
  } catch (error) {
    console.error("CREATE_DISCOUNT_ERROR", JSON.stringify(error, null, 2));

    return {
      ok: false,
      message: error?.message || "Unknown error",
      graphQLErrors: error?.body?.errors?.graphQLErrors || error?.graphQLErrors || null,
      raw: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
    };
  }
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
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(fetcher.data, null, 2)}
        </pre>
      )}
    </div>
  );
}