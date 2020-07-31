import React from "react";

interface BackProps {
  href?: string;
  button?: boolean;
  text?: string;
}

export default class Back extends React.Component<BackProps> {
  constructor(props: Readonly<BackProps>) {
    super(props);
  }

  render() {
    return (
      <a
        href={this.props.href || "#"}
        onClick={function () {
          window.history.back();
        }}
        className={this.props.button ? "btn btn-outline-primary btn-sm" : ""}
      >
        {this.props.text || "Back"}
      </a>
    );
  }
}
