interface CpuGpuInput {
  Tdie?: { temp1_input: number };
  temp1?: { temp1_input: number };
  power1?: { power1_average: number };
}

export interface SensorsInput {
  /**
   * sensors -j outputs a difficult-to-type format where the property names can vary
   */
  [propName: string]: CpuGpuInput;
}

export interface CpuStatus {
  /**
   * Temperature in degrees Celcius
   */
  temp: number;
}

export interface GpuStatus extends CpuStatus {
  /**
   * Power in watts
   */
  power: number;
}

export interface SensorsOutput {
  /**
   * We process SensorsInput object into this more reasonable format
   */
  time: string;
  gpu: GpuStatus;
  cpu: CpuStatus;
}

export interface ProcessSensorDataFunction {
  /**
   * We have to include undefined in the possible return types to statisfy the type checker.
   * The only time this function can return undefined is there is an error, in which case Deno.exit(1) is
   * called without this function returning at all. Accordingly, it should never return undefined in practice.
   */
  (sensorsObject: SensorsInput): SensorsOutput | undefined;
}

export interface ShellCommandError extends Error {
  /** 
   * For errors that occur when shell commands are executed
   * */
}

export class ProcessSensorsError extends Error {
  /**
   * For errors that occur while processing SensorsInput
   */
}
