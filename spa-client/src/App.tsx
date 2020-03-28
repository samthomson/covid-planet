import React from "react";
import "./App.css";
import D3SVG from "./components/D3SVG";

function App() {
  return (
    <div className="App">
      [globe]
      <D3SVG width={400} height={250} />
      <hr />
      [controls]
      <hr />
      [table]
    </div>
  );
}

export default App;
