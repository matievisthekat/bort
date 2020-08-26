import React from "react";
import NavBar from "../NavBar";

interface HeaderProps {
  name?: string;
}

export default class Header extends React.Component<HeaderProps> {
  constructor(props: Readonly<HeaderProps>) {
    super(props);
  }

  public render() {
    return (
      <header className="header">
        <NavBar tabName={this.props.name} />
      </header>
    );
  }
}
