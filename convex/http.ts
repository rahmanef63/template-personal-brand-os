import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { dokuWebhook } from "./features/payment/http";

const http = httpRouter();
auth.addHttpRoutes(http);

// DOKU payment notification — set the dashboard Notification URL to
// https://<deployment>.convex.site/webhooks/doku
http.route({ path: "/webhooks/doku", method: "POST", handler: dokuWebhook });

export default http;
