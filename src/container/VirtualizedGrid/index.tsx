import React from "react";
import ReactDOM from "react-dom";
import OverviewListContainer from "./OverviewListContainer";
import './style.css'

class App extends React.Component {
  render() {
    return (
      <div className={"private-container"}>
        <div className={"left-column"} />
        <div className={"right-column"}>
          <OverviewListContainer />
        </div>
      </div>
    );
  }
}

export {
  App as VirtualizedGrid
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
