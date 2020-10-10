import fatalErrorHandler from "../errorHandlers.ts";
import type {
  SensorsOutput,
  CpuStatus,
  GpuStatus,
  ProcessSensorDataFunction
} from "../types.d.ts";

let processSensorsReading: ProcessSensorDataFunction;
processSensorsReading = (input) => {
  try {
    const keys: Array<string> = Object.keys(input);
    const gpuKey: string | undefined = keys.find((str) => /^amdgpu/.test(str));
    const cpuKey: string | undefined = keys.find((str) => /^k10temp/.test(str));
    if (gpuKey === undefined || cpuKey === undefined) {
      // unsupported hardware. we only support AMD {c/g}pus and likely only a subset of those. dedicated gpu required.
      throw new Error("Unsupported hardware");
    }
    // run-time validation of the input object shape as typescript can't help us here since the data comes from a shell command
    // we could use a class for SensorsInput and perform the validation there instead
    const inputIsValid: boolean = (
      input[cpuKey].hasOwnProperty("Tdie") &&
      typeof input[cpuKey].Tdie === "object" &&
      // the previous 2 lines verify that Tdie is an object, but TS doesn't know that
      // @ts-expect-error
      input[cpuKey].Tdie.hasOwnProperty("temp1_input") &&
      input[gpuKey].hasOwnProperty("temp1") &&
      typeof input[gpuKey].temp1 === "object" &&
      // @ts-expect-error
      input[gpuKey].temp1.hasOwnProperty("temp1_input") &&
      input[gpuKey].hasOwnProperty("power1") &&
      typeof input[gpuKey].power1 === "object" &&
      // @ts-expect-error
      input[gpuKey].power1.hasOwnProperty("power1_average")
    );
    if (!inputIsValid) {
      throw new Error("Input data lacks necessary properties");
    }
    const cpuOutput: CpuStatus = {
      // run-time validation of these properties was performed earlier
      // @ts-expect-error
      temp: input[cpuKey].Tdie.temp1_input,
    };
    const gpuOutput: GpuStatus = {
      // run-time validation of these properties was performed earlier
      // @ts-expect-error
      temp: input[gpuKey].temp1.temp1_input,
      // @ts-expect-error
      power: input[gpuKey].power1.power1_average,
    };
    const sensorsOutput: SensorsOutput = {
      time: new Date().toISOString(),
      cpu: cpuOutput,
      gpu: gpuOutput,
    };
    return sensorsOutput;
  } catch (error) {
    fatalErrorHandler(error);
  }
};

export default processSensorsReading;
