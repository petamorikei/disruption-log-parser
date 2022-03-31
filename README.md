# disruption-log-parser

Disruption Log Parser for Warframe.

## Description

Analyze the log file and extract disruption mission info including conduit
results, lap time per round, and mission score.

<img width="360" alt="image" src="https://user-images.githubusercontent.com/59867960/143371328-83b7507a-099d-4200-a174-2adf846586c6.png">

### About time splitting

- Unlock Door: From beginning of the mission to door unlock.
- 1st round: From door unlock to end of the round.
- 2nd - last round: From end of previous round to end of round (including
  interval).
- Extraction: From end of last round to extraction. This block is omitted if you
  leave mission in the middle of round.

### About summary section

- Mission Score: Your mission score to be displayed on the leaderboard.
- Average Time: Average time of rounds. This doesn't include `Unlock Door`
  section, `Extraction` section, and incomplete round.
- Total Time: Entire time of the mission including all of phases.

## Usage

Download an executable (.exe) from
[releases](https://github.com/petamorikei/disruption-log-parser/releases) and
launch it.

If you want to run this tool from command line, read below steps.

---

### Requirement

- [`deno`](https://deno.land/)

#### Install deno

PowerShell (Windows):

```
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

[`Chocolatey`](https://community.chocolatey.org/packages/deno) (Windows):

```
choco install deno
```

[`Scoop`](https://scoop.sh/) (Windows):

```
scoop install deno
```

### Run Disruption Log Parser

```
deno run --allow-read --allow-env=LOCALAPPDATA --allow-net=api.github.com ./src/main.ts [path/to/EE.log]
```

Default to read `%LOCALAPPDATA%\Warframe\EE.log`

### Build executable

- Windows

```
deno compile --allow-read --allow-env=LOCALAPPDATA --allow-net=api.github.com --output "DisruptionLogParser.exe" ./src/main.ts [path/to/EE.log]
```

- Cross compile (from other systems to Windows)

```
deno compile --allow-read --allow-env=LOCALAPPDATA --allow-net=api.github.com --output "DisruptionLogParser" --target x86_64-pc-windows-msvc ./src/main.ts [path/to/EE.log]
```

Default to read `%LOCALAPPDATA%\Warframe\EE.log`

## Caveats

- This tool reads your `EE.log` file located in `%LOCALAPPDATA%\Warframe\` and
  parses it.
- This tool can only analyze the mission when you were the host.
