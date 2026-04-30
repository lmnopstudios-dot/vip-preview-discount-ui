import { useFetcher } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(`
  mutation {
    discountAutomaticAppCreate(
      automaticAppDiscount: {
        title: "Bank Holiday Sale"
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
    return {
      ok: false,
      message: error?.message || "Unknown error",
      raw: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
    };
  }
};

export default function Index() {
  const fetcher = useFetcher();

  return (
    <div style={{ padding: 20 }}>
      <h1>Scope Check</h1>

      <fetcher.Form method="post">
        <button type="submit">Check Scopes</button>
      </fetcher.Form>

      {fetcher.data && (
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(fetcher.data, null, 2)}
        </pre>
      )}
    </div>
  );
}