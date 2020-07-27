import React from "react";
import Highlight from "react-highlight.js";
import { ICommandOpts } from "../../../lib/types";

interface CommandProps {
  opts: ICommandOpts;
}

export default class Command extends React.Component<CommandProps> {
  private opts: ICommandOpts;

  constructor(props: Readonly<CommandProps>) {
    super(props);

    this.opts = props.opts;
  }

  public render() {
    return (
      <>
        <div className="container">
          <div className="row text-light elegant-color">
            <div className="col-1 border-right">{this.opts.name}</div>
            <div className="col-4 border-right">{this.opts.description}</div>
            <div className="col-4">
              <div className="bg-dark">
                <Highlight language="dust">
                  {this.opts.name} {this.opts.usage}
                </Highlight>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
