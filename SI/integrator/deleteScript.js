const axios = require("axios");

const EVENT_TYPE = "payment_received";
const INTEGRATOR_ENDPOINT = "http://localhost:4000/webhooks/data";

axios
  .delete(`http://localhost:3000/webhooks/unregister/`, {
    data: {
      url: INTEGRATOR_ENDPOINT,
      event: EVENT_TYPE,
    },
  })
  .then((response) => {
    console.log("Endpoint unregistered successfully");
  })
  .catch((error) => {
    console.error("Error unregistering endpoint:", error);
  });
