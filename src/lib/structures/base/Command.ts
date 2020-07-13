import { ICommand } from "../../types";
import { Bort } from "../Client";

export class Command {
  constructor(private client: Bort, public opts: ICommand) {
    this.opts.usage = this.opts.args
      ?.map((a) => {
        const name = a.name.replace(/ +/gi, "_");
        return `${a.required ? "{" : "<"}${name}${a.required ? "}" : ">"}`;
      })
      .join(" ");
  }

  async run(msg, [command, args, flags]): Promise<any> {
    msg.client.logger.warn(
      `Command without a run method at ${this.opts.__filename}`
    );
  }

  unload() {
    const res = this.client.cmd.unloadCommand(this.opts.__filename);
    return res;
  }

  reload() {
    const unloadRes = this.unload();
    if (!unloadRes) return false;

    const res = this.client.cmd.loadCommand(this.opts.__filename);
    return res;
  }
}
