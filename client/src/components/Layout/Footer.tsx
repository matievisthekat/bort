import React, { ReactElement } from "react";

export default class Footer extends React.Component {
  constructor(props: Readonly<unknown>) {
    super(props);
  }

  public render(): ReactElement {
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
