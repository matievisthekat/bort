import React from "react";
import Axios from "axios";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Command from "../components/command";
import { ICommandOpts } from "../../../lib/types";

const config = require("../../../config.json");

interface IndexState {
  commands: Array<{ opts: ICommandOpts }>;
  error: string | void;
}

export default class Index extends React.Component<{}, IndexState> {
  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      commands: [],
      error: null,
    };
  }

  public async componentDidMount() {
    const res = await Axios.get(
      `http://${config.api.host}:${config.api.port}/commands`
    );

    if (res.data.statusCode === 200) this.setState({ commands: res.data.data });
    else this.setState({ error: res.data.status });
  }

  public render() {
    return (
      <>
        <SEO title="Home" />
        {this.state.commands.map((cmd, i) => (
          <Command key={i} name={cmd.opts.name} />
        ))}
        {this.state.error}
      </>
    );
  }
}
