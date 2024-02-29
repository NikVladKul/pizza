const evtSource = new EventSource("/events");

evtSource.addEventListener("open", () => {
  console.log("connection opened");
});
evtSource.addEventListener("error", () => {
  console.log("Error");
});
evtSource.addEventListener("message", (event) => {
  console.log(event.data);
});

