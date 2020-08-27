import React, { ReactElement } from "react";
import Layout from "../components/Layout/";
import SEO from "../components/Layout/SEO";

import Back from "../components/Back";

class NotFoundPage extends React.Component {
  constructor(props: Readonly<unknown>) {
    super(props);
  }
  public render(): ReactElement {
    return (
      <Layout>
        <SEO title="404: Not found" description="Page not found" />
        <div className="container text-center text-primary">
          <h1>Not found :(</h1>
          <p>You just hit a route that doesn&#39t exist... the sadness.</p>
          <Back button={true} />
        </div>
      </Layout>
    );
  }
}

export default NotFoundPage;
