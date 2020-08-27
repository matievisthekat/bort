import React, { ReactElement } from "react";

import Layout from "../components/Layout";
import SEO from "../components/Layout/SEO";

interface State {
  error: string;
}

export default class Index extends React.Component<unknown, State> {
  constructor(props: Readonly<unknown>) {
    super(props);

    this.state = {
      error: "",
    };
  }

  public render(): ReactElement {
    return (
      <Layout path="home">
        <SEO title="Home" description="Bort's homepage" />
        <div className="container text-primary text-center">Home</div>
      </Layout>
    );
  }
}
