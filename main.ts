import getSensorsReading from "./sensors/getSensorsReading.ts";
import processSensorsReading from "./sensors/processSensorsReading.ts";
import generateChart from "./chart/generateChart.ts";
import type { CpuStatus, GpuStatus, SensorsOutput } from "./types.d.ts";
import { onSignal } from "https://deno.land/std@0.69.0/signal/mod.ts";

// ten seconds in ms
const intervalMs = 10000;

// const readings: Array<SensorsOutput> = [];
const labels: Array<SensorsOutput["time"]> = [];
const cpuTempData: Array<CpuStatus["temp"]> = [];
const gpuTempData: Array<GpuStatus["temp"]> = [];
const gpuPowerData: Array<GpuStatus["power"]> = [];

const takeReading = async (): Promise<void> => {
  const rawSensorsReading = await getSensorsReading();
  let outputSensorsReading: SensorsOutput | undefined;
  if (rawSensorsReading) {
    outputSensorsReading = processSensorsReading(rawSensorsReading);
  }
  // We have to check for undefined here, even though that should not be possible.
  if (outputSensorsReading) {
    // readings.push(outputSensorsReading);
    labels.push(outputSensorsReading.time);
    cpuTempData.push(outputSensorsReading.cpu.temp);
    gpuTempData.push(outputSensorsReading.gpu.temp);
    gpuPowerData.push(outputSensorsReading.gpu.power);
  }
};

const interval = setInterval(takeReading, intervalMs);

console.log(`Monitoring temps every ${intervalMs / 1000} seconds`);
console.log("Press Ctrl + C to stop");

// Deno.Signal requires --unstable flag
// @ts-ignore
onSignal(Deno.Signal.SIGINT, () => {
  clearInterval(interval);
  generateChart(labels, [cpuTempData, gpuTempData]);
  Deno.exit(1);
});
