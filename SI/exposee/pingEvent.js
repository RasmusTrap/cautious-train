const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("webhooks.db");

// function to ping registered webhooks
async function pingWebhooks() {
  const events = [
    "payment_received",
    "payment_processed",
    "invoice_processing",
    "invoice_completed",
  ];

  for (const event of events) {
    const payload = { event, data: { message: "This is a test payload" } };
    const webhooks = await getWebhooksForEvent(event);

    for (const webhook of webhooks) {
      try {
        const response = await axios.post(webhook.url, payload);
        console.log(
          `Ping sent to webhook for event ${event} at URL ${webhook.url}:`,
          response.data
        );
      } catch (error) {
        console.error(
          `Error pinging webhook for event ${event} at URL ${webhook.url}:`,
          error.message
        );
      }
    }
  }
}

// function to get registered webhooks for a specific event
function getWebhooksForEvent(event) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM webhooks WHERE event = ?", [event], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// ping webhooks every 30 seconds
setInterval(pingWebhooks, 30000);
