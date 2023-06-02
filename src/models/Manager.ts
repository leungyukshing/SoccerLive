import { StatusBarItem, Command, Uri, window } from "vscode";
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
        console.debug("old socres: ", this.scores);
        console.debug("newScores: ", newScores);
        // this.compareMatchDiff(this.scores, newScores);
        this.scores = newScores;
        this.lastUpdated = moment();
    }
    
    rollTicker() {
        console.debug("rollTicker start");
        // console.debug(this.ticker);
        console.debug(this.scores.length);
        // console.debug(this.scores);
        if (this.ticker && this.scores && this.scores.length > 0) {
            const score = this.currenScore();
            const command: Command | null = score.urlLive ? {
                title: score.url,
                command: "vscode.open",
                arguments: [Uri.parse(score.url)],
            } : null;
            // console.debug(score);
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
        console.debug("getHover start");
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

    compareMatchDiff(oldScores: Score[], newScores: Score[]) {
        var notification: string = "";
        var oldScoreMap :Map<number, Score>;
        oldScores.forEach((score: Score) => {
            oldScoreMap.set(score.gameId, score);
        });

        newScores.forEach((score: Score) => {
            if (oldScoreMap.has(score.gameId)) {
                // same match, check update on score
                var oldScore = oldScoreMap.get(score.gameId);
                if (oldScore?.homeScore !== score.homeScore || oldScore.awayScore !== score.awayScore) {
                    // add to notification
                    notification += score.homeTeamName + " - " + score.awayTeamName + " " + "Goal\n";
                }
            }
        });
        
        window.showInformationMessage(notification);
    }
}