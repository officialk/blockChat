import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn]);
  return (
    <BrowserRouter>
      <Header />
      <br />
      <br />
      <br />
      <br />
      <Switch>
        <Route path="/" exact>
          {isLoggedIn ? <Home /> : <Login />}
        </Route>
        <Route path="/settings" exact>
          {isLoggedIn ? <Settings /> : <Login />}
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
