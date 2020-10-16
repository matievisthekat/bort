import { Link } from "gatsby";
import React, { ReactElement } from "react";
import NavbarIcons from "./Icons";
import NavBarTabs from "./Tabs";

interface Props {
  tabName?: string;
}

export default class NavBar extends React.Component<Props, unknown> {
  private tabName?: string;

  constructor(props: Readonly<Props>) {
    super(props);

    this.tabName = this.props.tabName ? this.props.tabName.toLowerCase() : "<none>";
  }

  public render(): ReactElement {
    return (
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark indigo lighten-2 scrolling-navbar">
        <Link className="navbar-brand" to="/">
          <strong>bort </strong>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <NavBarTabs name={this.tabName} />
          <NavbarIcons />
        </div>
      </nav>
    );
  }
}
