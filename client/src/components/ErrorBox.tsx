import React, { ReactElement } from "react";

interface Props {
  message: string;
}

export default class ErrorBox extends React.Component<Props, unknown> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  public render(): ReactElement {
    return (
      <div className="container text-center text-danger">
        <h5>{this.props.message}</h5>
      </div>
    );
  }
}
