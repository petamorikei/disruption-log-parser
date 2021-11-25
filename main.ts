import * as path from "https://deno.land/std@0.115.1/path/mod.ts";

import { parseLog } from "./logParser.ts";
import { outputStats } from "./logger.ts";

const readLog = (path: string) => {
  const data = Deno.readTextFileSync(path);
  return data;
};

const main = () => {
  let eelogPath: string | undefined;
  if (Deno.args.length !== 0) {
    eelogPath = Deno.args[0];
  } else {
    const localAppDataPath = Deno.env.get("LOCALAPPDATA");
    if (localAppDataPath) {
      eelogPath = path.join(localAppDataPath, "Warframe", "EE.log");
    } else {
      throw new Error("%LOCALAPPDATA% does NOT exist");
    }
  }
  try {
    const logData = readLog(eelogPath);
    const stats = parseLog(logData);
    outputStats(stats);
  } catch (error) {
    console.error(error);
    console.log();
  }

  console.log();
  prompt("Press any key to exit...");
};

main();
