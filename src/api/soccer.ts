import axios from "axios";
import Game from "../models/Game";
import Team from "../models/Team";
import Status from "../models/Status";
import Detail from "../models/Detail";
import { env } from "process";
import { time } from "console";

const baseURL: Readonly<string> = "https://www.fotmob.com/api"; // TODO
const HEADERS = {
    "Content-Type": "application/json"
};

export function fetchGameDetails(matchId: number): Promise<void | Detail[]> {
    console.log("fetchGameDetails start...");
    var url = baseURL + "/matchDetails?" + `matchId=${matchId}`;
    console.log("url: " + url);
    return axios.get(url, { headers: HEADERS })
        .then(({ status, statusText, data }) => {
            console.log(`GET ${url} ${status} ${statusText}`);
            var events = data.header.events;
            console.log(events);
            let homeTeamGoals = events.homeTeamGoals;
            let awayTeamGoals = events.awayTeamGoals;
            console.log(homeTeamGoals);
            console.log(awayTeamGoals);
            let homeTeamGoalsJson = JSON.parse(JSON.stringify(homeTeamGoals));
            let awayTeamGoalsJson = JSON.parse(JSON.stringify(awayTeamGoals));
            console.log(homeTeamGoalsJson);
            let details : Detail[] = [];
            Object.keys(homeTeamGoalsJson).forEach(function(key) {
                console.log(key);
                let goals = homeTeamGoalsJson[key];
                console.log(goals);
                goals.forEach((element: { nameStr: string; time: number; type: string; goalDescription: string; }) => {
                    details.push(new Detail(1, element.nameStr, element.time, element.type, element.goalDescription));
                });``
            });

            Object.keys(awayTeamGoalsJson).forEach(function(key) {
                let goals = awayTeamGoalsJson[key];
                goals.forEach((element: { nameStr: string; time: number; type: string; desc: string; }) => {
                    details.push(new Detail(2, element.nameStr, element.time, element.type, element.desc));
                });``
            });
            
            details.sort((a, b) => {
                return a.time - b.time;
            })

            console.log(details);
            return details;            
        })
        .catch((error) => {
            console.error(error); 
        })
}

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
                return l.matches.map((m: {id: number, home: Team, away: Team, statusId: number, status: Status, timeTS: number;} ) => {
                    //console.log("each match: " + m);
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
                    }
                });
            });
        })
        .catch((error) => {
            console.error(error);
        })
}