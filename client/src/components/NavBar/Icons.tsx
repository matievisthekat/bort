import React from "react";

interface Props {}
interface State {}

export default class NavbarIcons extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  public render() {
    return (
      <ul className="navbar-nav nav-flex-icons">
        <li className="nav-item">
          <a className="nav-link" href="https://discord.gg/5j4hTMJ" target="_blank">
            <i className="fab fa-discord"></i>
          </a>
        </li>
      </ul>
    );
  }
}
