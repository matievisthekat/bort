import React from "react";

import Layout from "../components/Layout";
import SEO from "../components/SEO";

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
        <SEO title="Home" description="Bort's homepage" />
        <div className="container text-danger text-center">Home</div>
      </Layout>
    );
  }
}
