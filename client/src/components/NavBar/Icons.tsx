import React, { ReactElement } from "react";
import Button from "react-bootstrap/Button";
import Cookie from "js-cookie";

export default class NavbarIcons extends React.Component<unknown, unknown> {
  constructor(props: Readonly<unknown>) {
    super(props);
  }

  public render(): ReactElement {
    const user = Cookie.getJSON("user");
    console.log(user);

    return (
      <ul className="navbar-nav nav-flex-icons">
        <li className="nav-item">
          <Button as={user ? "div" : "a"} href="/login" className="btn-sm" disabled={!!user}>
            {user ? user.username : "Login"}
          </Button>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="https://discord.gg/5j4hTMJ" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-discord"></i>
          </a>
        </li>
      </ul>
    );
  }
}
