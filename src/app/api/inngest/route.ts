import { serve } from "inngest/next";
import { inngest } from "src/app/utils/inngest/client";
import { handleJobExpiry, helloWorld } from "./functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    handleJobExpiry,
    /* your functions will be passed here later! */
  ],
});