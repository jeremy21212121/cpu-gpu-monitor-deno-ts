/**
 * Loads the chart's client JS dependencies for insertion into the HTML template
 * Requires --allow-read
 */

import fatalErrorHandler from "../errorHandlers.ts";

const clientScriptPaths = ["chart/client/Chart.min.js", "chart/client/utils.js"];

const getClientDepencies = async (): Promise<string[]> => {
  let output = ["", ""];
  try {
    // reads in the js files
    output = await Promise.all(
      clientScriptPaths.map((s) => Deno.readTextFile(s)),
    );
  } catch (error) {
    fatalErrorHandler(error);
  }
  return output;
};

export default getClientDepencies;
