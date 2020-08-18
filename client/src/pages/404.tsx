import React from "react";

import Layout from "../components/Layout";
import SEO from "../components/SEO";

class NotFoundPage extends React.Component {
  constructor(props: Readonly<{}>) {
    super(props);
  }
  public render() {
    return (
      <Layout>
        <SEO title="404: Not found" description="Page not found" />
        <div className="container text-center text-light">
          <h1>Not found :(</h1>
          <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
        </div>
      </Layout>
    );
  }
}

export default NotFoundPage;
