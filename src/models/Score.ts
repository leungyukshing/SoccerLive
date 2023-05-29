import * as moment from "moment";
import Game from "./Game";
import { fetchGameDetails } from "../api/soccer";
import Detail from "./Detail";
import { config } from "../extension";

export default class Score {
    gameId: number;
    details: void | Detail[] = [];
    homeScore: number;
    homeTeamName: string;
    awayScore: number;
    awayTeamName: string;
    tipoff: moment.Moment;
    liveTime: string;
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

        this.url = "https://www.fotmob.com/" + `match/${this.gameId}/matchfacts`;
        this.urlLive = moment() >= this.tipoff;

        this.liveTime = game.status.liveTime.long;
        fetchGameDetails(this.gameId).then(details => {
            this.details = details;
        });
    }

    format(formatString: string): string {
        // console.log("format start: " + formatString);
        return formatString
            .replace(/\${vTeam}/gi, this.awayTeamName)
            .replace(/\${vScore}/gi, this.awayScore.toString(10))
            .replace(/\${hTeam}/gi, this.homeTeamName)
            .replace(/\${hScore}/gi, this.homeScore.toString(10))
            .replace(/\${liveTime}/gi, this.liveTime);
    }

    formatDetail(foramtString: string, detail: Detail): string {
        return foramtString
        .replace(/\${time}/gi, detail.time.toString())
        .replace(/\${team}/gi, detail.team === 1 ? this.homeTeamName : this.awayTeamName)
        .replace(/\${player}/gi, detail.player)
        .replace(/\${type}/gi, detail.type)
        .replace(/\${desc}/gi, detail.desc ? detail.desc : "None");
    }

    getDetail(): string {
        var result: string = "";
        if (this.details) {
            this.details.forEach(element => {
                result += this.formatDetail(config("detailFormat"), element) + "\n";
            });
        }
        // console.log(result);
        return result;
    }
}