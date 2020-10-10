# CPU/GPU monitoring

This is a Deno / TypeScript project to monitor AMD CPU/GPUs on linux. I wanted a nice graph of my GPU temps over time, I also wanted to try out Deno, so here we are.

Running `main.ts` will take measurements every 10 seconds, then generates an HTML chart on SIGINT (Ctrl + C).

It depends on having a `sensors` binary on your path, with should be the case with most common linux distros AFAIK.


## Running

```
deno run --allow-run --allow-read --allow-write --unstable main.ts
```

> `--allow-run` to spawn another process (`sensors`), `--unstable` because we are using `Deno.Signal` for handing SIGINT

> `--allow-read` to read in the chart's client JS depenencies, `--allow-write` to write the chart in the public directory

It will take readings every 10 seconds until receiving SIGINT (Ctrl+C), then generate a chart HTML file in the `public` directory.

The chart shows the CPU/GPU temps over time. It is also storing the GPU power draw in watts, but it is not currently incorporated into the chart.
