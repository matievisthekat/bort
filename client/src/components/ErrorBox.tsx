import React from "react";

interface Props {
  message: string;
}
interface State {}

export default class ErrorBox extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  public render() {
    return (
      <div className="container text-center text-danger">
        <h5>{this.props.message}</h5>
      </div>
    );
  }
}
