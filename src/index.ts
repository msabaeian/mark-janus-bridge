import initExpressRoutes from "./controller/http/start";
import initSocketEvents from "./controller/socket/start";
import boot from "./kernel/boot";

(async () => {
  const { shutdown } = await boot();
  initExpressRoutes()
  initSocketEvents()


  const handleClose = (signal: string) => () => {
      console.info(`Received signal ${signal}`);
      shutdown();
  };

  process.on("SIGINT", handleClose("SIGINT"));
  process.on("SIGTERM", handleClose("SIGTERM"));
})();
