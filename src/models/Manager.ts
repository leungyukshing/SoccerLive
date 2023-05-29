import { StatusBarItem, Command, Uri } from "vscode";
import {config} from "../extension";
import * as moment from "moment";
import Score from "./Score";

export default class Manager {
    ticker: StatusBarItem;
    scores: Score[];
    currentPos: number = 0;
    teams: string[];
    lastUpdated: moment.Moment | null = null;

    constructor(ticker: StatusBarItem, scores: Score[] = []) {
        this.ticker = ticker;
        this.scores = scores;
        this.teams = config("teamFilter");
    }

    currenScore(): Score {
        return this.scores[this.currentPos];
    }

    updateScores(newScores: Score[]) {
        this.scores = newScores;
        this.lastUpdated = moment();
    }
    
    rollTicker() {
        console.log("rollTicker start");
        // console.log(this.ticker);
        console.log(this.scores.length);
        // console.log(this.scores);
        if (this.ticker && this.scores && this.scores.length > 0) {
            const score = this.currenScore();
            const command: Command | null = score.urlLive ? {
                title: score.url,
                command: "vscode.open",
                arguments: [Uri.parse(score.url)],
            } : null;
            // console.log(score);
            this.setTicker(score.format(config("format")), this.getHover(), command);
            this.incrementPos();
        } else if (this.ticker) {
            this.setTicker("No games.", this.humanLastUpdated());
        }
    }

    setTicker(text: string, tooltip: string | null = null, command: Command | null = null) {
        this.ticker.text = text;
        if (tooltip) {
            this.ticker.tooltip = tooltip;
        }
        if (command) {
            this.ticker.command = command;
        }
        this.ticker.show();
    }

    incrementPos() {
        this.currentPos = (this.currentPos + 1) % this.scores.length;
    }

    humanLastUpdated(): string {
        if (this.lastUpdated) {
            return `Updated ${this.lastUpdated.fromNow()}.`;
        } else {
            return "Waiting for games.....";
        }
    }

    getHover(): string {
        const hoverContent : string[] = [];
        console.log("getHover start");
        if (config("hover") === "details") {
            hoverContent.push(this.currenScore().getDetail());
        } else if (config("hover") === "scoreboard") {
            this.scores.forEach((score) => {
                hoverContent.push(score.format(config("format")));
            });
        }
        hoverContent.push("\n");
        hoverContent.push(this.humanLastUpdated());
        return hoverContent.join("\n");
    }
}