import { createManifestHandler } from "@saleor/app-sdk/handlers/next";
import { AppManifest } from "@saleor/app-sdk/types";

import packageJson from "../../../package.json";
import { transactionRefundRequestedWebhookFactory } from "./webhooks/transaction-refund-requested";

export default createManifestHandler({
  async manifestFactory({ appBaseUrl, request }) {
    const iframeBaseUrl = process.env.APP_IFRAME_BASE_URL ?? appBaseUrl;
    const apiBaseURL = process.env.APP_API_BASE_URL ?? appBaseUrl;

    const saleorVersion = request.headers ? request.headers["saleor-schema-version"] : "";
    console.log(`saleorVersion: ${saleorVersion}`);

    const manifest: AppManifest = {
      name: "Saleor App Template",
      tokenTargetUrl: `${apiBaseURL}/api/register`,
      appUrl: iframeBaseUrl,
      permissions: ["HANDLE_PAYMENTS"],
      id: "saleor.app",
      version: packageJson.version,
      webhooks: [
        transactionRefundRequestedWebhookFactory(saleorVersion).getWebhookManifest(apiBaseURL),
      ],
      extensions: [],
      author: "Saleor Commerce",
      brand: {
        logo: {
          default: `${apiBaseURL}/logo.png`,
        },
      },
    };

    return manifest;
  },
});
