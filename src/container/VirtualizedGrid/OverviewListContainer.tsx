import React from "react";
import ReactDOM from "react-dom";
import OverviewList from "./OverviewList";
import fakerData from "./fakerData";
import PropTypes from "prop-types";

class OverviewListContainer extends React.PureComponent {
  // static childContextTypes = {
  //   customElement: PropTypes.any,
  // };
  // containerRef = React.createRef();



  constructor(props) {
    super(props);
    // this.myRef = React.createRef();
    this.state = {};
  }

  // getChildContext () {
  //   const { container } = this.state;
  //   return {
  //     customElement: container,
  //   };
  // }

  render() {
    // console.log("this.state.container", this.state.container);
    return (
      <>
      <div className={"header-sticky"}>Sticky Header</div>
      <div
        id="scroll-wrapper"
        className="content-container"
        ref={(e) => this.setState({ container: e })}
      >
        
        {this.state.container && (
          <OverviewList
            container={this.state.container}
            items={fakerData(1000)}
          />
        )}
      </div>
      </>
      
    );
  }
}

export default OverviewListContainer;
