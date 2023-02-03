import * as moment from "moment";
import Game from "./Game";

export default class Score {
    gameId: number;
    details: string[] = [];
    homeScore: number;
    homeTeamName: string;
    awayScore: number;
    awayTeamName: string;
    tipoff: moment.Moment;
    url: string;
    urlLive: boolean;

    constructor(game: Game) {
        // console.log(game);
        this.gameId = game.id;
        this.homeScore = game.home.score;
        this.homeTeamName = game.home.name;
        this.awayScore = game.away.score;
        this.awayTeamName = game.away.name;
        this.tipoff = moment(game.timeTS);

        this.url = "";
        this.urlLive = moment() >= this.tipoff;

        // this.status = this.buildStatus(game);
    }

    format(formatString: string): string {
        // console.log("format start: " + formatString);
        return formatString
            .replace(/\${vTeam}/gi, this.awayTeamName)
            .replace(/\${vScore}/gi, this.awayScore.toString(10))
            .replace(/\${hTeam}/gi, this.homeTeamName)
            .replace(/\${hScore}/gi, this.homeScore.toString(10))
    }

    // Determine status string.
    /*
    buildStatus(game: Game): string {
        if (this.tipoff) {
            if (moment() < this.tipoff || game.period < 1) {
                return this.tipoff.format("h:mm A");
            } else {
                return game.gameStatusText;
            }
        } else {
            return "TBD";
        }
    }
    */
}