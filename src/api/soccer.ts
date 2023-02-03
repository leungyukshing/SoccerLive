import axios from "axios";
import Game from "../models/Game";
import Team from "../models/Team";

const baseURL: Readonly<string> = "https://www.fotmob.com/api"; // TODO
const HEADERS = {
    "Content-Type": "application/json"
};

export function fetchGames(): Promise<Game[][]> {
    console.log("fetchGames start...");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    var date = yyyy + mm + dd;
    var url = baseURL + "/matches?" + `date=${date}`;
    console.log("url: " + url);
    return axios.get(url, { headers: HEADERS })
        .then(({ status, statusText, data }) => {
            console.log(`GET ${url} ${status} ${statusText}`);
            // console.log(data);
            // return data.scoreboard.games;
            return data.leagues.map((l: { id: number, ccode: string, name: string, matches: any;}) => {
                //console.log("each leagues: " + l);
                return l.matches.map((m: {id: number, home: Team, away: Team, statusId: number, timeTS: number;} ) => {
                    //console.log("each match: " + m);
                    return {
                        id: m.id,
                        leagueId: l.id,
                        leagueCode: l.ccode,
                        leagueName: l.name,
                        home: m.home,
                        away: m.away,
                        statusId: m.statusId,
                        timeTS: m.timeTS
                    }
                });
            });
        })
        .catch((error) => {
            console.error(error);
        })
}