import axios from "axios";
import Game from "../models/Game";
import Team from "../models/Team";
import Status from "../models/Status";
import Detail from "../models/Detail";

const baseURL: Readonly<string> = "https://www.fotmob.com/api";
const matchesUrl: Readonly<string> = "/matches?";
const matchDetailsUrl: Readonly<string> = "/matchDetails?";
const HEADERS = {
    "Content-Type": "application/json"
};

export function fetchGameDetails(matchId: number): Promise<void | Detail[]> {
    console.log("fetchGameDetails start...");
    var url = baseURL + matchDetailsUrl + `matchId=${matchId}`;
    console.log("url: " + url);
    return axios.get(url, { headers: HEADERS })
        .then(({ status, statusText, data }) => {
            console.log(`GET ${url} ${status} ${statusText}`);
            var events = data.header.events;
            // console.debug(events);
            if (!events) {
                return;
            }
            let homeTeamGoals = events.homeTeamGoals;
            let awayTeamGoals = events.awayTeamGoals;
            // console.debug(homeTeamGoals);
            // console.debug(awayTeamGoals);
            let details : Detail[] = [];

            if (homeTeamGoals) {
                let homeTeamGoalsJson = JSON.parse(JSON.stringify(homeTeamGoals));
                Object.keys(homeTeamGoalsJson).forEach(function(key) {
                    // console.debug(key);
                    let goals = homeTeamGoalsJson[key];
                    // console.debug(goals);
                    goals.forEach((element: { nameStr: string; time: number; type: string; goalDescription: string; }) => {
                        details.push(new Detail(1, element.nameStr, element.time, element.type, element.goalDescription));
                    });
                });
            }
            if (awayTeamGoals) {
                let awayTeamGoalsJson = JSON.parse(JSON.stringify(awayTeamGoals));
                Object.keys(awayTeamGoalsJson).forEach(function(key) {
                    let goals = awayTeamGoalsJson[key];
                    goals.forEach((element: { nameStr: string; time: number; type: string; desc: string; }) => {
                        details.push(new Detail(2, element.nameStr, element.time, element.type, element.desc));
                    });
                });
            }
            // console.debug(homeTeamGoalsJson);

            // sort events based on time
            details.sort((a, b) => {
                return a.time - b.time;
            });

            // console.debug(details);
            return details;            
        })
        .catch((error) => {
            console.error(error); 
        });
}

export function fetchGames(): Promise<Game[][]> {
    console.debug("fetchGames start...");
    var today = new Date();
    today.setHours(today.getHours() + 6);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    var date = yyyy + mm + dd;
    var url = baseURL + matchesUrl + `date=${date}`;
    console.debug("url: " + url);
    return axios.get(url, { headers: HEADERS })
        .then(({ status, statusText, data }) => {
            console.debug(`GET ${url} ${status} ${statusText}`);
            // console.debug(data);
            return data.leagues.map((l: { id: number, ccode: string, name: string, matches: any;}) => {
                // console.debug("each leagues: " + l);
                return l.matches.map((m: {id: number, home: Team, away: Team, statusId: number, status: Status, timeTS: number;} ) => {
                    // console.debug("each match: " + m);
                    return {
                        id: m.id,
                        leagueId: l.id,
                        leagueCode: l.ccode,
                        leagueName: l.name,
                        home: m.home,
                        away: m.away,
                        statusId: m.statusId,
                        status: m.status,
                        timeTS: m.timeTS
                    };
                });
            });
        })
        .catch((error) => {
            console.error(error);
        });
}