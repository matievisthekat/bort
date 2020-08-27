import React, { ReactElement } from "react";
import { Command } from "../../../lib";
import Highlight from "react-highlight.js";

interface Props {
  commands: Array<Command>;
}

export default class CommandTable extends React.Component<Props, unknown> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  public render(): ReactElement {
    return (
      <table className="table text-light">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Usage</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {this.props.commands.map((cmd, i) => (
            <tr key={i}>
              <th scope="row">{cmd.opts.name}</th>
              <td>
                <Highlight language="dust">
                  {cmd.opts.name} {cmd.opts.usage}
                </Highlight>
              </td>
              <td>{cmd.opts.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
