import * as path from "https://deno.land/std@0.115.1/path/mod.ts";

import { parseLog } from "./logParser.ts";

const readLog = (path: string) => {
  const data = Deno.readTextFileSync(path);
  return data;
};

// TODO: Check environment variable "localappdata"

const main = () => {
  let eelogPath: string | undefined;
  if (Deno.args.length !== 0) {
    eelogPath = Deno.args[0];
  } else {
    const userProfilePath = Deno.env.get("USERPROFILE");
    if (userProfilePath) {
      eelogPath = path.join(
        userProfilePath,
        "AppData",
        "Local",
        "Warframe",
        "EE.log"
      );
    } else {
      throw new Error("EE.log does NOT exist");
    }
  }
  const logData = readLog(eelogPath);
  parseLog(logData);
};

main();
