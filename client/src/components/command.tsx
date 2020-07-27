import React from "react";

interface CommandProps {
  name: string;
}

export default class Command extends React.Component<CommandProps> {
  constructor(props: Readonly<CommandProps>) {
    super(props);
  }

  public render() {
    return (
      <div className="container text-light elegant-color">
        {this.props.name}
      </div>
    );
  }
}
