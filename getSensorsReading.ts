/**
 * Runs the 'sensors' binary and returns a SensorsInput object
 */
import type { SensorsInput, ShellCommandError } from "./types.ts";

import fatalErrorHandler from "./errorHandlers.ts";

const getSensorsReading = async (): Promise<SensorsInput|undefined> => {
  try {
    // Run the sensors command with the -j option for JSON output
    const cmd = Deno.run({
      cmd: ["sensors", "-j"],
      stdout: "piped",
      stderr: "piped",
    });
    // read stdout
    const cmdOutput: Uint8Array = await cmd.output();
    const cmdOutputString: string = new TextDecoder().decode(cmdOutput);
    // read stderr - there should be none of this
    const stdErr: Uint8Array = await cmd.stderrOutput();
    cmd.close();
    // Check for stderr or lack of stdout output
    if (stdErr.length || !cmdOutputString.length) {
      const errorString = new TextDecoder().decode(stdErr);
      const newError: ShellCommandError = new Error(
        errorString || `Error running "sensors" shell command`,
      );
      throw newError;
    }
    // Parse command output
    const cmdOutputObject: SensorsInput = JSON.parse(cmdOutputString);
    return cmdOutputObject;
  } catch (error) {
    // log error and exit
    fatalErrorHandler(error);
  }
};

export default getSensorsReading;
