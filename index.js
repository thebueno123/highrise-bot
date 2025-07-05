import WebSocket from "ws";
import dotenv from "dotenv";
dotenv.config();

const socket = new WebSocket("wss://gateway.highrise.game/websocket");

socket.on("open", () => {
  console.log("✅ Connected to Highrise gateway");

  socket.send(
    JSON.stringify({
      _type: "AuthenticateRequest",
      token: process.env.API_KEY,
    })
  );
});

socket.on("message", (data) => {
  const message = JSON.parse(data);
  console.log("📨", message);

  if (
    message._type === "UserJoinedEvent" &&
    message.user &&
    message.user.username
  ) {
    const username = message.user.username;

    socket.send(
      JSON.stringify({
        _type: "SendMessageRequest",
        message: `👋 Welcome in @${username}! 🎁 1 item per person | 💺 Sit in line | 💸 Tips appreciated!`,
        roomId: process.env.ROOM_ID,
      })
    );
  }
});

socket.on("error", (error) => {
  console.error("❌ WebSocket error:", error);
});

