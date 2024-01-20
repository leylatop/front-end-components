import React from "react";
import ReactDOM from "react-dom";
import OverviewList from "./OverviewList";
import fakerData from "./fakerData";
import PropTypes from "prop-types";

class OverviewListContainer extends React.PureComponent {
  static childContextTypes = {
    customElement: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {};
  }

  getChildContext() {
    const { container } = this.state;
    return {
      customElement: container,
    };
  }

  render() {
    return (
      <div
        id="scroll-wrapper"
        className="content-container"
        ref={(e) => this.setState({ container: e })}
      >
        <div className={"header-sticky"}>Sticky Header</div>
        <div className={"artwork"}>Not so sticky artwork</div>

        {this.state.container && (
          <OverviewList
            container={this.state.container}
            items={fakerData(1000)}
          />
        )}
      </div>
    );
  }
}

export default OverviewListContainer;
