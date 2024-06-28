import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import Login from "./Login";
import Callback from "./Callback";
import Home from "./Home";
import ProtectedRoute from "./ProtectedRoute";
import TaskList from "./TaskList";

const App = () => (
  <Router>
    <AuthProvider>
      <Switch>
        <Route path="/callback" component={Callback} />
        <Route path="/login" component={Login} />
        <ProtectedRoute path="/tasks" component={TaskList} />
        <ProtectedRoute path="/" component={Home} />
      </Switch>
    </AuthProvider>
  </Router>
);

export default App;
