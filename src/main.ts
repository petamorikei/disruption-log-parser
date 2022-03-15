import * as path from "https://deno.land/std@0.115.1/path/mod.ts";

import { Logger } from "./Logger.ts";
import { LogParser } from "./LogParser.ts";
import { checkUpdate } from "./utils.ts";

const version = "v0.4.0";
const author = "@petamorikei";

const getLogPath = (args: string[]) => {
  if (args.length > 0) {
    return args[0];
  } else {
    const localAppDataPath = Deno.env.get("LOCALAPPDATA");
    if (localAppDataPath) {
      return path.join(localAppDataPath, "Warframe", "EE.log");
    } else {
      throw new Error("%LOCALAPPDATA% does NOT exist");
    }
  }
};

const main = async () => {
  console.log(`Disruption Log Parser ${version} by ${author}`);
  await checkUpdate(version);
  try {
    const logPath = getLogPath(Deno.args);
    try {
      const logParser = new LogParser();
      const stats = await logParser.parse(logPath);
      const logger = new Logger();
      logger.outputStats(stats);
    } catch (error) {
      console.error(error);
    }
  } catch (e) {
    console.error(e);
  }

  console.log();
  prompt("Press any key to exit...");
};

main();
