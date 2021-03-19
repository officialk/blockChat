import { io } from "socket.io-client";
const ws = io("http://localhost:8080/");

ws.on("syserr", (data) => {
  alert(data.err);
});

ws.on("sysmsg", (data) => {
  // alert(data.data);
});
export default ws;
