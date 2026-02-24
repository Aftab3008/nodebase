import { checkout, polar, portal } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});

export const polarPlugin = polar({
  client: polarClient,
  createCustomerOnSignUp: true,
  use: [
    checkout({
      products: [
        {
          productId: "f5e1f9de-d379-41f0-9897-6c083d189108",
          slug: "pro",
        },
      ],
      successUrl: "http://localhost:3000",
      authenticatedUsersOnly: true,
    }),
    portal(),
  ],
});
