import { AppBar, IconButton, Toolbar } from "@material-ui/core";
import { ExitToAppRounded } from "@material-ui/icons";
import React from "react";
import { auth } from "../functions/firebase";

export default function Header() {
  return (
    <AppBar>
      <Toolbar edge="end">
        {localStorage.getItem("loggedIn") === "true" ? (
          <IconButton
            color="secondary"
            onClick={() => {
              auth.signOut().then((res) => {
                localStorage.clear();
                window.location.reload();
              });
            }}
          >
            <ExitToAppRounded />
          </IconButton>
        ) : (
          <></>
        )}
      </Toolbar>
    </AppBar>
  );
}
