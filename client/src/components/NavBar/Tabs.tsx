import React from "react";

interface Props {
  name?: string;
}
interface State {}

export default class NavBarTabs extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  public render() {
		const current = <span className="sr-only">(current)</span>;
		
    return (
      <ul className="navbar-nav mr-auto">
        <li className={this.props.name === "home" ? "nav-item active" : "nav-item"}>
          <a className="nav-link" href="/">
            Home {this.props.name === "home" ? current : ""}
          </a>
        </li>
        <li className={this.props.name === "commands" ? "nav-item active" : "nav-item"}>
          <a className="nav-link" href="/commands">
            Commands {this.props.name === "commands" ? current : ""}
          </a>
        </li>
      </ul>
    );
  }
}
