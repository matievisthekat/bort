import React from "react";

type Colour =
  | "primary"
  | "danger"
  | "secondary"
  | "success"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "link";

type Size = "sm" | "md" | "lg";

interface ButtonProps {
  href: string;
  text: string;
  size?: Size;
  colour?: Colour;
  outlineColour?: Colour;
  outline?: boolean;
  openInNewtab?: boolean;
  onClick?(): any;
}

export default class Button extends React.Component<ButtonProps> {
  private classes: string;

  constructor(props) {
    super(props);

    this.classes = `btn btn-${this.props.size || "primary"} btn-${
      this.props.colour || "primary"
    } ${this.props.outline ? `btn-outline-${this.props.outlineColour}` : ""}`;
  }

  render() {
    return (
      <a
        href={this.props.href}
        target={this.props.openInNewtab ? "_blank" : ""}
        className={this.classes}
        onClick={this.props.onClick}
      >
        {this.props.text}
      </a>
    );
  }
}
