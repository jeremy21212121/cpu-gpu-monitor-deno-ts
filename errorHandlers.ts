const fatalErrorHandler = (err: Error): void => {
  console.log("Fatal error. Exiting.");
  console.error(err);
  Deno.exit(1);
};

export default fatalErrorHandler;
