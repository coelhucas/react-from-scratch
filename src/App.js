import React from "react";
import { hot } from "react-hot-loader/root";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <h1 data-testid="page-title">So long, and thanks for all fish the 🐟</h1>
    </div>
  );
};

export default hot(App);
