import React from "react";
import { Helmet } from "react-helmet";

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <footer className="page-footer font-small elegant-color-dark fixed-bottom">
        <div className="footer-copyright text-center py-3">
          © 2020 Copyright:
          <a href="https://bortondiscord.xyz/"> bort</a>
        </div>
      </footer>
    );
  }
}
