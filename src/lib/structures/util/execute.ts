import { promisify } from "util";
import { exec } from "child_process";
const realExec = promisify(exec);

export async function execute(command: string): Promise<any> {
  let error = null;
  const result = await realExec(command).catch((err) => (error = err));
  return {
    stdin: result?.stdin,
    stdout: result?.stdout,
    stderr: result?.stderr,
    error
  };
}
