import {
  Avatar,
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import ws from "../functions/socket";

const enc = (data, pass) => {
  return window.sjcl.encrypt(pass, data);
};

const dec = (data, pass) => {
  return window.sjcl.decrypt(pass, data);
};

var room = "";
var password = "";
var messages = [];

var lastMessage = Date.now();

export default function Home() {
  const setPassword = (pass) => (password = pass);
  const setRoom = (rom) => (room = rom);
  const setMessages = (mssg) => (messages = mssg);
  const [isAccepted, setIsAccepted] = useState(0);

  const reRender = () => {
    ReactDOM.render(
      messages.length === 0 ? (
        <Typography variant="h5" align="center">
          Send A Message!
          <br /> <br />
        </Typography>
      ) : (
        <Messages />
      ),
      document.getElementById("messages")
    );
  };

  ws.on("sysmsg", (data) => {
    if (data.messages[0] !== undefined) {
      try {
        dec(
          data.messages[0].data.message,
          password || document.getElementById("password").value
        );
        setMessages(data.messages);
        setIsAccepted(true);
        reRender();
      } catch (e) {
        alert("Password Doesnt Match");
      }
    } else {
      setMessages(data.messages);
      setIsAccepted(true);
      reRender();
    }
  });
  ws.on("message", (data) => {
    if (data.timestamp - lastMessage) {
      lastMessage = data.timestamp;
      let cpy = messages;
      cpy.push(data);
      setMessages(cpy);
      reRender();
    }
  });

  const RoomForm = () => {
    return (
      <div>
        <Typography variant="h5" align="center">
          Room Settings
        </Typography>
        <TextField id="room" fullWidth label="Room Name" />
        <br />
        <br />
        <TextField
          id="password"
          type="password"
          fullWidth
          label="Room Password"
        />
        <br />
        <br />
        <br />
        <ButtonGroup color="primary" variant="contained" size="large" fullWidth>
          <Button
            color="secondary"
            onClick={() => {
              let _room = document.getElementById("room").value;
              let _password = document.getElementById("password").value;
              if (_room !== "" && _password !== "") {
                setRoom(_room);
                setPassword(_password);
                ws.emit("createRoom", {
                  room: _room,
                });
              }
            }}
          >
            Create Room
          </Button>
          <Button
            onClick={() => {
              let _room = document.getElementById("room").value;
              let _password = document.getElementById("password").value;
              if (_room !== "" && _password !== "") {
                setRoom(_room);
                setPassword(_password);
                ws.emit("joinRoom", {
                  room: _room,
                });
              }
            }}
          >
            Join Room
          </Button>
        </ButtonGroup>
      </div>
    );
  };

  const MessageUI = () => {
    return (
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
        style={{ height: "90vh" }}
      >
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <TextField fullWidth label="type message" id="message" />
          </Grid>
          <Grid item xs={2}>
            <IconButton
              color="primary"
              onClick={() => {
                let mssg = document.getElementById("message").value;

                if (mssg !== "") {
                  document.getElementById("message").disabled = true;
                  let encMssg = enc(mssg, password);
                  ws.emit("message", {
                    room: room,
                    message: encMssg,
                    pic: localStorage.getItem("pic"),
                    name: localStorage.getItem("name"),
                  });
                  document.getElementById("message").value = "";
                  setTimeout(() => {
                    document.getElementById("message").disabled = false;
                  }, 1000);
                }
              }}
            >
              <SendIcon variant="container" />
            </IconButton>
          </Grid>
        </Grid>
        <div
          style={{
            width: "100%",
            maxHeight: "80%",
            overflowY: "auto",
            overflowX: "hidden",
          }}
          id="messages"
        ></div>
      </Grid>
    );
  };

  const Messages = () => {
    return (
      <List style={{}}>
        {messages.reverse().map((e, i) => {
          return (
            <Tooltip title={e.hash} key={room + i} placement="bottom" arrow>
              <ListItem
                alignItems="center"
                divider
                style={{ cursor: "pointer" }}
              >
                <ListItemAvatar>
                  <Avatar src={e.data.pic} />
                </ListItemAvatar>
                <ListItemText
                  primary={e.data.name}
                  secondary={dec(e.data.message, password)}
                />
              </ListItem>
            </Tooltip>
          );
        })}
      </List>
    );
  };
  return !isAccepted ? <RoomForm /> : <MessageUI />;
}
