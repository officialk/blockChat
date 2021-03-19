import { Button } from "@material-ui/core";
import React from "react";
import { auth, firebase } from "../functions/firebase";
export default function Login() {
  return (
    <center>
      <br />
      <br />

      <Button
        variant="contained"
        fullWidth
        color="primary"
        onClick={() => {
          var provider = new firebase.auth.GoogleAuthProvider();
          provider.addScope(
            "https://www.googleapis.com/auth/contacts.readonly"
          );
          auth
            .signInWithPopup(provider)
            .then((res) => {
              console.log(res);
              localStorage.setItem("loggedIn", "true");
              localStorage.setItem("name", res.user.displayName);
              localStorage.setItem("pic", res.user.photoURL);
              localStorage.setItem("id", res.user.uid);
              window.location.reload();
            })
            .catch((e) => {
              console.error(e);
            });
        }}
      >
        Join With Google
      </Button>
    </center>
  );
}
