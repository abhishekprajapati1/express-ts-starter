// import "module-alias/register"; // IMP: do not remove it. Helps with module resolution in dist directory.
import app from "./app";
import config from "@/config";
import { logger } from "@/utils/logger";

app.listen(config.port, () => {
  logger.info("Using environment " + config.environment);
  logger.info(`Server is running on http://localhost:${config.port}`);
});
