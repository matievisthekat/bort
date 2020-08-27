import React, { ReactElement } from "react";
import Layout from "../components/Layout";
import SEO from "../components/Layout/SEO";

import axios from "axios";
import config from "../../../src/config";

import Category from "../components/Category";
import ErrorBox from "../components/ErrorBox";

interface State {
  categories: Array<string> | void;
  error: string;
}

export default class Commands extends React.Component<unknown, State> {
  constructor(props: Readonly<unknown>) {
    super(props);

    this.state = {
      categories: null,
      error: null,
    };
  }

  public async componentDidMount(): Promise<void> {
    const res = await axios.get(`http://${config.api.host}:${config.api.port}/categories`).catch(() => null);
    if (res && res.data.status === 200) {
      this.setState({ categories: res.data.data });
      this.setState({ error: null });
    } else {
      this.setState({ error: "Failed to fetch command categories. Please try again" });
    }
  }

  public render(): ReactElement {
    return (
      <Layout path="commands">
        <SEO title="Commands" description="All the commands for bort" />
        <div className="container">
          {this.state.categories ? this.state.categories.map((cat, i) => <Category name={cat} key={i} />) : this.state.error ? <ErrorBox message={this.state.error} /> : null}
        </div>
      </Layout>
    );
  }
}
