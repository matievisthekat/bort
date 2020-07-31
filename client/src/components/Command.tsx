import React from "react";
import Highlight from "react-highlight.js";
import { CommandOptions } from "../../../lib/types";
import Button from "./Button";

interface CommandProps {
  opts: CommandOptions;
}

export default class Command extends React.Component<CommandProps> {
  private opts: CommandOptions;

  constructor(props: Readonly<CommandProps>) {
    super(props);

    this.opts = props.opts;
  }

  public render() {
    return (
      <div className="container">
        <div className="row text-center text-light elegant-color">
          <div className="col-2 border-right">{this.opts.name}</div>
          <div className="col-5 border-right">{this.opts.description}</div>
          <div className="col-4 border-right">
            <div className="bg-dark">
              <Highlight language="dust">
                {this.opts.name} {this.opts.usage}
              </Highlight>
            </div>
          </div>
          <div className="col-1">
            <Button
              text="More"
              href={`/commands?name=${this.opts.name}`}
              size="sm"
              colour="secondary"
              outline={true}
              outlineColour="light"
            />
          </div>
        </div>
      </div>
    );
  }
}
