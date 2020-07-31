import React from "react";
import Axios from "axios";

import Layout from "../components/layout";
import SEO from "../components/seo";
import Command from "../components/command";
import { ICommandOpts } from "../../../lib/types";

const config = require("../../../config.json");

interface IndexState {
  commands: Array<{ opts: ICommandOpts }>;
  error: string;
}

export default class Index extends React.Component<{}, IndexState> {
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
      <Layout path="home">
        <SEO title="Home" />
        <div className="container text-danger text-center">
          Home
        </div>
      </Layout>
    );
  }
}
