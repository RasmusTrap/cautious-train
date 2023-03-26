const axios = require("axios");

function sendWebhookData(eventType, data) {
  const endpoints = registeredEndpoints[eventType];
  if (endpoints) {
    endpoints.forEach((endpoint) => {
      const payload = {
        event: eventType,
        data: data,
      };
      axios
        .post(endpoint, payload)
        .then((response) => {
          console.log(
            `Data successfully sent to ${endpoint}. Response:`,
            response.data
          );
        })
        .catch((error) => {
          console.error(`Error sending data to ${endpoint}:`, error);
        });
    });
  }
}

sendWebhookData("payment_received", { data: "dummy" });
