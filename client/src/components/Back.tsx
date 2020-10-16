import { Link } from "gatsby";
import React, { ReactElement } from "react";

interface BackProps {
  href?: string;
  button?: boolean;
  text?: string;
}

export default class Back extends React.Component<BackProps> {
  constructor(props: Readonly<BackProps>) {
    super(props);
  }

  public render(): ReactElement {
    return (
      <Link
        to={this.props.href || "#"}
        onClick={() => window.history.back()}
        className={this.props.button ? "btn btn-outline-primary btn-sm" : ""}
      >
        {this.props.text || "Back"}
      </Link>
    );
  }
}
