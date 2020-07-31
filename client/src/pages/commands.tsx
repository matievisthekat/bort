import React from "react";
import Axios from "axios";
import queryString from "query-string";

import Layout from "../components/Layout";
import SEO from "../components/SEO";
import Command from "../components/Command";
import Back from "../components/Back";
import { CommandOptions } from "../../../lib/types";

const config = require("../../../config.json");

interface CommandsState {
  commands: Array<{ opts: CommandOptions }>;
  error: string;
  command: void | { opts: CommandOptions };
}

export default class Comamnds extends React.Component<{}, CommandsState> {
  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      commands: [],
      error: "",
      command: null,
    };
  }

  public async componentDidMount() {
    try {
      const res = await Axios.get(
        `http://${config.api.host}:${config.api.port}/commands`
      );
      if (res.data.statusCode === 200)
        this.setState({ commands: res.data.data });

      const { name } = queryString.parse(window.location.search);
      if (name) {
        const command = this.state.commands.find(
          (cmd) => cmd.opts.name === name
        );

        if (command) {
          this.setState({ command });
        } else {
          return this.setState({
            error: "No command with that name was found",
          });
        }
      }
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  public render() {
    return (
      <Layout path="commands">
        <SEO title="Commands" />
        <div className="container text-danger text-center">
          {this.state.error ? (
            <div className="container text-center">
              <Back button={false} text="Go back?" />
            </div>
          ) : (
            ""
          )}
        </div>
        <br />
        {this.state.command ? (
          <Command opts={this.state.command.opts} />
        ) : (
          <div className="container center">
            {this.state.commands.map((cmd, i) => (
              <Command key={i} opts={cmd.opts} />
            ))}
          </div>
        )}
      </Layout>
    );
  }
}
