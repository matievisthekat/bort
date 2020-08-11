import React from "react";
import Scripts from "./Scripts";
import NavBar from "./NavBar";

interface HeaderProps {
  name?: string;
}

export default class Footer extends React.Component<HeaderProps> {
  constructor(props: Readonly<HeaderProps>) {
    super(props);
  }

  public render() {
    return (
      <header className="header">
        <Scripts />
        <NavBar tabName={this.props.name} />
      </header>
    );
  }
}
