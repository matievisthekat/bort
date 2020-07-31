import React from "react";

import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { CommandOptions } from "../../../lib/types";

const config = require("../../../config.json");

interface IndexState {
  error: string;
}

export default class Index extends React.Component<{}, IndexState> {
  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      error: "",
    };
  }

  public render() {
    return (
      <Layout path="home">
        <SEO title="Home" />
        <div className="container text-danger text-center">Home</div>
      </Layout>
    );
  }
}
