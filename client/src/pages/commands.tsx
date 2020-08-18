import React from "react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

interface Props {}
interface State {}

export default class Commands extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  public render() {
    return (
      <Layout path="commands">
        <SEO title="Commands" description="All the commands for bort" />
        <div className="container text-danger text-center">Commands</div>
      </Layout>
    );
  }
}
