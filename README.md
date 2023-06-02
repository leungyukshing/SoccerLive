# Soccerlive  [![Version](https://img.shields.io/visual-studio-marketplace/v/leungyukshing.soccerlive)](https://marketplace.visualstudio.com/items?itemName=leungyukshing.soccerlive) [![Installs](https://img.shields.io/visual-studio-marketplace/i/leungyukshing.soccerlive)](https://marketplace.visualstudio.com/items?itemName=leungyukshing.soccerlive)  [![CI](https://github.com/leungyukshing/SoccerLive/actions/workflows/ci.yaml/badge.svg)](https://github.com/leungyukshing/SoccerLive/actions/workflows/ci.yaml)

<img src="https://raw.githubusercontent.com/leungyukshing/SoccerLive/master/images/football.png" height="128">



SoccerLive is an amazing extension to keep you updated with the live score of soccer games when coding with [Visual Studio Code](https://code.visualstudio.com/).

## Requirement

Please make sure your VSCode is connecting to internet.

## 💾 Installation

SoccerLive can be installed via the VS Code [Marketplace](https://marketplace.visualstudio.com/items?itemName=leungyukshing.soccerlive).

Or you can download from [Release Page](https://github.com/leungyukshing/SoccerLive/releases). Download the `.vsix` file and then follow [Install from a VSIX](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix) to install it.

## ⚙️ Settings

The settings documented here are a subset of the supported settings.

### Quick Example

Below is an example of a [settings.json](https://code.visualstudio.com/docs/getstarted/settings) file with settings relevant to SoccerLive:

```json
{
  	"soccer-live.hover": "details",
    "soccer-live.tickerDelaySeconds": 5,
    "soccer-live.pollDelaySeconds": 120,
    "soccer-live.includedLeague": "42, 47, 54, 87, 113, 112, 144, 881923",
}
```

### SoccerLive settings

These settings are specific to SoccerLive.

| Setting                          | Description                                                  | Type   | Default value                                          |
| -------------------------------- | ------------------------------------------------------------ | ------ | ------------------------------------------------------ |
| `soccer-live.includedLeague`     | Specifies which league info should be displayed. You should use leagueId. | String | `42, 47, 54, 87`                                       |
| `soccer-live.format`             | Specifies how the game info should be displayed.             | String | `${hTeam} ${hScore} - ${vScore} ${vTeam}, ${liveTime}` |
| `soccer-live.detailFormat`       | Specifies how the game detail should be displayed.           | String | `${time}' (${team}) ${player} ${type} (${desc})`       |
| `soccer-live.hover`              | Specifies what to show when hovering over the ticker.        | String | `scoreboard`                                           |
| `soccer-live.tickerDelaySeconds` | Specifies the interval for rolling scores in the ticker.     | Int    | 5                                                      |
| `soccer-live.pollDelaySeconds`   | specifies how often the score is refreshed.                  | int    | 120                                                    |

## How to start

Once you install the extension, you are ready to start!

1. Run the command from the command palette by pressing (`Ctrl+Shift+P` on Windows or `Cmd+Shift+P` on Mac) and typing `LiveScore`. Then you will see the extension is activated.

## Features

We support two modes to display match scores now.

### ScoreBoard Mode

You will see game score in the ticker and when you hover your mouse over there, you can see other matches.

![ScoreBoard](https://raw.githubusercontent.com/leungyukshing/SoccerLive/master/images/scoreboard.gif)

### GameDetail Mode

You will see game details like score, assist when you hover your mouse over the ticker.

![GameDetails](https://raw.githubusercontent.com/leungyukshing/SoccerLive/master/images/gamedetail.gif)
