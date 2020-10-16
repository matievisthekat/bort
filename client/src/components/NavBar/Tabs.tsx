import React, { ReactElement } from "react";
import { Link } from "gatsby";
import { pages } from "../../config";

interface Props {
  name?: string;
}

export default class NavBarTabs extends React.Component<Props, unknown> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  public render(): ReactElement {
    const current = <span className="sr-only">(current)</span>;
    const getSlug = (name: string): string => name.toLowerCase().replace(/ +/gi, "-");

    return (
      <ul className="navbar-nav mr-auto">
        {pages.map((p, i) => (
          <li key={i} className={this.props.name === getSlug(p.name) ? "nav-item active" : "nav-item"}>
            <Link className="nav-link" to={p.href}>
              {p.name} {this.props.name === getSlug(p.name) ? current : ""}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
}
