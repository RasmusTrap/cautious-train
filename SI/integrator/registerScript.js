const axios = require("axios");

const EXPOSEE_URL = "http://localhost:3000"; // replace with actual Exposee URL
const INTEGRATOR_ENDPOINT = "http://localhost:4000/webhooks/data"; // replace with actual integrator endpoint
const EVENT_TYPE = "payment_received"; // replace with actual event type

// register endpoint
axios
  .post(`${EXPOSEE_URL}/webhooks/register/${EVENT_TYPE}`, {
    event: EVENT_TYPE,
    url: INTEGRATOR_ENDPOINT,
  })
  .then((response) => {
    console.log(`Endpoint registered for event type ${EVENT_TYPE}`);
    console.log("Response:", response.data);
  })
  .catch((error) => {
    console.error("Error registering endpoint:", error);
  });
