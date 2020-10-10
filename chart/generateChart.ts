import buildHtml from "./buildHtml.ts";

/**
 * Generates chart HTML, writes it to disk in public directory and logs the results
 * Requires --allow-write
 * @param labels 
 * @param chartData 
 */
const generateChart = (labels: string[], chartData: number[][]): void => {
  const html = buildHtml(labels, chartData);
  const timeStamp = Date.now();
  const filePath = `public/chart-${timeStamp}.html`;
  try {
    Deno.writeTextFileSync(`./${filePath}`, html);
  } catch (error) {
    console.log("Error writing chart to disk");
    console.error(error);
  }
  // log an empty line for aesthetic purposes
  console.log("");
  console.log(`Chart has been written to disk at ${filePath}`);
};

export default generateChart;
