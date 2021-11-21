# disruption-log-parser
Disruption Log Parser for Warframe.
- Analyze the log file and extract disruption mission info includes conduit result, lap time per round and mission score.

<img width="360" alt="image" src="https://user-images.githubusercontent.com/59867960/142774950-ec50218e-593a-4e3b-8f42-e4f80ea99180.png">


## Getting started
- Install [`deno`](https://deno.land/)

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
- Run script
## Usage
```
deno run --allow-read --allow-env=LOCALAPPDATA .\main.ts [path\to\EE.log]
```

## Build
```
deno compile --allow-read --allow-env=LOCALAPPDATA --output "DisruptionLogParser.exe" .\main.ts [path\to\EE.log]
```

## Caveats
- This tool reads your `EE.log` file located in `%LOCALAPPDATA%\Warframe\` and parses it.