# disruption-log-parser

Disruption Log Parser for Warframe.

## Description

Analyze the log file and extract disruption mission info including conduit
results, lap time per round, and mission score.

<img width="360" alt="image" src="https://user-images.githubusercontent.com/59867960/143371328-83b7507a-099d-4200-a174-2adf846586c6.png">

## Requirement

- [`deno`](https://deno.land/)

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

## Usage

### Run Disruption Log Parser

```
deno run --allow-read --allow-env=LOCALAPPDATA .\main.ts [path\to\EE.log]
```

Default to read `%LOCALAPPDATA%\Warframe\EE.log`

### Build executable

- Windows

```
deno compile --allow-read --allow-env=LOCALAPPDATA --output "DisruptionLogParser.exe" .\main.ts [path\to\EE.log]
```

- Cross compile (from other systems to Windows)

```
deno compile --allow-read --allow-env=LOCALAPPDATA --output "DisruptionLogParser" --target x86_64-pc-windows-msvc ./main.ts [path\to\EE.log]
```

Default to read `%LOCALAPPDATA%\Warframe\EE.log`

## Caveats

- This tool reads your `EE.log` file located in `%LOCALAPPDATA%\Warframe\` and
  parses it.
- This tool can only analyze the mission when you were the host.
