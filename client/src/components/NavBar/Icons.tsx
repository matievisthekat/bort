import React from "react";
import Button from "react-bootstrap/Button";
import Cookie from "js-cookie";

interface Props {}
interface State {}

export default class NavbarIcons extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  public render() {
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
          <a className="nav-link" href="https://discord.gg/5j4hTMJ" target="_blank">
            <i className="fab fa-discord"></i>
          </a>
        </li>
      </ul>
    );
  }
}
