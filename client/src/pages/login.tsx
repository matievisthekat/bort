import React, { ReactElement } from "react";
import Layout from "../components/Layout";
import SEO from "../components/Layout/SEO";
import { oauth } from "../config";

export default class Login extends React.Component<unknown, unknown> {
  constructor(props: Readonly<unknown>) {
    super(props);
  }

  public render(): ReactElement {
    const refParts = document.referrer.split("/");
    const refOrigin = `${refParts[0]}//${refParts[1]}${refParts[2]}`;
    window.localStorage.setItem("postLoginURL", refOrigin === window.location.origin ? document.referrer : "/");
    window.location.href = oauth.url(process.env.CLIENT_ID);

    return (
      <Layout path="login">
        <SEO title="Login" description="Login using your Discord account" />
        <div className="container text-primary text-center">Please wait while you are redirected...</div>
      </Layout>
    );
  }
}
