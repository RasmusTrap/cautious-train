const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("webhooks.db");
const axios = require("axios");

const expressJSDocSwagger = require("express-jsdoc-swagger");
const options = {
  info: {
    version: "1.0.0",
    title: "Webhooks - Exposee",
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

db.run(
  "CREATE TABLE IF NOT EXISTS webhooks (id INTEGER PRIMARY KEY AUTOINCREMENT, event TEXT, url TEXT)"
);

app.use(express.json());

/**
 * POST /webhooks/register/:eventType
 * @summary To register a webhook. Requires an event type as param, and url-endpoint in body.
 * @tags webhook
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
app.post("/webhooks/register/:eventType", (req, res) => {
  const eventType = req.params.eventType;
  const url = req.body.url;

  db.run(
    "INSERT INTO webhooks (event, url) VALUES (?, ?)",
    [eventType, url],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Failed to register webhook");
      }
      console.log(
        `Webhook registered for event ${eventType} with URL ${url} and ID ${this.lastID}`
      );
      const id = this.lastID;
      sendWebhookData(eventType, { data: "dummy" }, this.lastID);
      res.send(`Webhook registered successfully with ID ${id}`);
    }
  );
});

/**
 * DELETE /webhooks/register/:eventType
 * @summary To unregister a webhook. Requires an event type and url-endpoint in body.
 * @tags webhook
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
app.delete("/webhooks/unregister", (req, res) => {
  const event = req.body.event;
  const url = req.body.url;

  db.run(
    "DELETE FROM webhooks WHERE event = ? AND url = ?",
    [event, url],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Failed to unregister webhook");
      }
      console.log(`Webhook unregistered for event ${event} with URL ${url}`);
      res.send("Webhook unregistered successfully");
    }
  );
});

function sendWebhookData(event, data, id) {
  db.all(
    "SELECT * FROM webhooks WHERE event=? AND id=?",
    [event, id],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
      rows.forEach((row) => {
        const url = row.url;
        axios
          .post(url, { event, data })
          .then(() => {
            console.log(
              `Data sent to webhook for event ${event} at URL ${url}:`,
              data
            );
          })
          .catch((error) => {
            console.error(
              `Failed to send data to webhook for event ${event} at URL ${url}:`,
              error
            );
          });
      });
    }
  );
}

/**
 * GET /webhooks/senddata/:event
 * @summary Send dummy data to any event type
 * @tags webhook
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
app.get("/webhooks/senddata/:event", (req, res) => {
  const event = req.params.event;
  const data = { message: "This is a test data payload" };
  sendWebhookData(event, data);
  res.send(`Test data sent for event ${event}`);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port 3000");
});
