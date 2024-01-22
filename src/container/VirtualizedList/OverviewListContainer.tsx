import React from "react";
import OverviewList from "./OverviewList";
import fakerData from "./fakerData";

class OverviewListContainer extends React.PureComponent {
render() {
    return (
      <>
        <div className={"header-sticky"}>Sticky Header</div>
        <div id="scroll-wrapper" className="content-container">
          <OverviewList items={fakerData(1000)} />
        </div>
      </>
    );
  }
}

export default OverviewListContainer;
