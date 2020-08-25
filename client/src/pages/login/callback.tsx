import React from "react";
import qs from "querystring";
import axios from "axios";
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import { oauth } from "../../config";

interface Props {}
interface State {
  error: string;
  user: any;
}

export default class Callback extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      error: null,
      user: null,
    };
  }

  public async componentDidMount() {
    const { code } = qs.parse(window.location.href.split("?")[1]);
    if (!code) return (window.location.href = "/login");

    let error = null;
    const secret = process.env.CLIENT_SECRET;
    const id = process.env.CLIENT_ID;
    const url = "https://discord.com/api/oauth2/token";
    const res = await axios
      .post(
        url,
        qs.stringify({
          client_id: id,
          client_secret: secret,
          grant_type: "authorization_code",
          code,
          redirect_uri: oauth.callbackURL,
          scope: oauth.scope.join(" "),
        })
      )
      .catch((err) => (error = err));
    if (error) {
      console.error(error);
    } else {
      const data = res.data;
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const uRes = await axios.get(`https://discord.com/api/users/@me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const user = uRes.data;
      this.setState({ user });
      window.location.href = "/";
    }

    this.setState({ error: error?.message });
  }

  public render() {
    if (this.state.user) {
      
    }

    return (
      <Layout path="/login/callback">
        <SEO title="Login" description="You probably shouldn't be here..." />
        {this.state.error ? (
          <div className="container text-danger text-center">
            An unexpected error occured: {this.state.error}
            <br />
            Please{" "}
            <a href="/login" className="">
              try again
            </a>
          </div>
        ) : (
          <div className="container text-primary text-center">Please wait while you are redirected...</div>
        )}
      </Layout>
    );
  }
}
