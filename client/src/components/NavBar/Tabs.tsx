import React from "react";
import { pages } from "../../config";

interface Props {
  name?: string;
}
interface State {}

export default class NavBarTabs extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  public render() {
    const current = <span className="sr-only">(current)</span>;
    const getSlug = (name: string): string => name.toLowerCase().replace(/ +/gi, "-");

    return (
      <ul className="navbar-nav mr-auto">
        {pages.map((p, i) => (
          <li key={i} className={this.props.name === getSlug(p.name) ? "nav-item active" : "nav-item"}>
            <a className="nav-link" href={p.href}>
              {p.name} {this.props.name === getSlug(p.name) ? current : ""}
            </a>
          </li>
        ))}
      </ul>
    );
  }
}
