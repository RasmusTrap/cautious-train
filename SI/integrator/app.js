const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const expressJSDocSwagger = require("express-jsdoc-swagger");
const options = {
  info: {
    version: "1.0.0",
    title: "Webhooks - Integrator",
    license: {
      name: "MIT",
    },
  },
  filesPattern: "./app.js",
  baseDir: __dirname,
  security: {
    BasicAuth: {
      type: "http",
      scheme: "basic",
    },
  },
};

expressJSDocSwagger(app)(options);

// middleware to parse request body as JSON
app.use(express.json());

/**
 * POST /webhooks/data/
 * @summary Receives data when webhooks is registered to this
 * @tags webhook
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
// endpoint to receive webhook data
app.post("/webhooks/data", (req, res) => {
  const event = req.body.event;
  const data = req.body.data;

  // take appropriate action based on event type
  switch (event) {
    case "payment_received":
      // handle payment received event
      console.log("Payment received:", data);
      break;
    case "payment_processed":
      // handle payment processed event
      console.log("Payment processed:", data);
      break;
    case "invoice_processing":
      // handle invoice processing event
      console.log("Invoice processing:", data);
      break;
    case "invoice_completed":
      // handle invoice completed event
      console.log("Invoice completed:", data);
      break;
    default:
      console.log("Unknown event:", event);
  }

  // send response back to webhook
  res.send("Webhook received");
});

// start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
