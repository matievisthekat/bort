import React from "react";
import { Helmet } from "react-helmet";

interface HeaderProps {
  name?: string;
}

export default class Footer extends React.Component<HeaderProps> {
  private name: string;

  constructor(props) {
    super(props);

    this.name = this.props.name ? this.props.name.toLowerCase() : "<none>";
  }

  public render() {
    const current = <span className="sr-only">(current)</span>;

    return (
      <header className="header">
        <Helmet>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.4/umd/popper.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/js/bootstrap.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.19.1/js/mdb.min.js"></script>
        </Helmet>
        
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark indigo lighten-2 scrolling-navbar">
          <a className="navbar-brand" href="/">
            <strong>bort </strong>
          </a>
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
            <ul className="navbar-nav mr-auto">
              <li
                className={
                  this.name === "home" ? "nav-item active" : "nav-item"
                }
              >
                <a className="nav-link" href="/">
                  Home {this.name === "home" ? current : ""}
                </a>
              </li>
              <li
                className={
                  this.name === "commands" ? "nav-item active" : "nav-item"
                }
              >
                <a className="nav-link" href="/commands">
                  Commands {this.name === "commands" ? current : ""}
                </a>
              </li>
            </ul>
            <ul className="navbar-nav nav-flex-icons">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="https://discord.gg/5j4hTMJ"
                  target="_blank"
                >
                  <i className="fab fa-discord"></i>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}
