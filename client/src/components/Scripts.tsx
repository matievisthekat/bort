import React from "react";
import { Helmet } from "react-helmet";

interface Props {}
interface State {}

export default class Scripts extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  render() {
    return (
      <Helmet>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.4/umd/popper.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/js/bootstrap.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.19.1/js/mdb.min.js"></script>
      </Helmet>
    );
  }
}
