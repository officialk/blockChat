import { io } from "socket.io-client";
const ws = io("https://wsbchat.karthikkoppaka.com");

ws.on("syserr", (data) => {
  alert(data.err);
});

ws.on("sysmsg", (data) => {
  alert(data.data);
});
export default ws;
