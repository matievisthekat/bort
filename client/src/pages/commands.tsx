import React from "react";
import Axios from "axios";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Command from "../components/command";
import { ICommandOpts } from "../../../lib/types";

const config = require("../../../config.json");

interface CommandsState {
  commands: Array<{ opts: ICommandOpts }>;
  error: string;
}

export default class Comamnds extends React.Component<{}, CommandsState> {
  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      commands: [],
      error: "",
    };
  }

  public async componentDidMount() {
    try {
      const res = await Axios.get(
        `http://${config.api.host}:${config.api.port}/commands`
      );
      if (res.data.statusCode === 200)
        this.setState({ commands: res.data.data });
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  public render() {
    return (
      <Layout path="commands">
        <SEO title="Commands" />
        <div className="container text-danger text-center">
          {this.state.error}
        </div>
        <div className="container center">
          {this.state.commands.map((cmd, i) => (
            <Command key={i} opts={cmd.opts} />
          ))}
        </div>
      </Layout>
    );
  }
}
