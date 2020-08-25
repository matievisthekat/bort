import React from "react";
import axios from "axios";
import { Command } from "../../../lib";
import { Collapse, Button } from "react-bootstrap";
import config from "../../../src/config";
import CommandTable from "./CommandTable";

interface Props {
  name: string;
}
interface State {
  expanded: boolean;
  error: string;
  commands: Array<Command>;
}

export default class Category extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      expanded: false,
      error: null,
      commands: null,
    };
  }

  public async componentDidMount() {
    const res = await axios.get(`http://${config.api.host}:${config.api.port}/categories/${this.props.name}`).catch(() => {});
    if (res && res.data.status === 200) {
      this.setState({ commands: res.data.data });
    } else {
      this.setState({ error: "Failed to fetch commands for this category. Please try again" });
    }
  }

  public setExpanded(expanded: boolean) {
    this.setState({ expanded });
  }

  public render() {
    return (
      <>
        <Button
          onClick={() => this.setExpanded(!this.state.expanded)}
          aria-controls="collapse-category"
          aria-expanded={this.state.expanded}
          className="container shadow-md p-1 mb-5 bg-dark rounded text-capitalize text-monospace text-white-50 text-center"
          as="div"
          variant="dark"
        >
          {this.props.name}
        </Button>
        <Collapse in={this.state.expanded}>
          <div>{this.state.commands ? <CommandTable commands={this.state.commands} /> : this.state.error || "Error"}</div>
        </Collapse>
      </>
    );
  }
}
