import Manager from "./models/Manager";
import Game from "./models/Game";
import Score from "./models/Score";
import { fetchGames } from "./api/soccer";
import { config } from "./extension";

export function fetchScores(manager: Manager): Promise<Manager> {
    //const teamFilter = config("teamFilter") || [];
    // TODO: validate setting and use default
    var leaguesStr = config("includedLeague");
    // console.log("leaguesStr: " + leaguesStr);
    var leagueArr = leaguesStr.split(",");
    // console.log(leagueArr);
    leagueArr.forEach((val: string, index: any) => {
        leagueArr[index] = +(val.trim());
    });
    leagueArr = leagueArr.filter(function(str: string) {
        return str !== "";
    });

    // console.log(leagueArr);

    return fetchGames()
        .then((games) => {
            console.log("In fetchScores, games: ");
            var result : Game[] = [];
            games.forEach((game) => {
                result.push(...game);
            })
            // console.log(result);
      /*
            if (teamFilter.length > 0) {
                games = games.filter((game) => {
                    return teamFilter.includes(game.homeTeam.teamTricode) || teamFilter.includes(game.awayTeam.teamTricode);
                });
            }
*/
            result = result.filter(function(item) {
                
                // console.log(leagueArr);
                // 42 -> Champions League
                // 47 -> Premier League
                // 87 -> LaLiga
                // 54 -> Bundesliga
                return leagueArr.includes(item.leagueId); // filter matches based on configurationq
            });
            
            result = result.filter(function(item) {
                // filter live matches
                return item.status.started && !item.status.finished;
            })
            // console.log(result);
            return buildScores(result);
        })
        .then((newScores) => {
            console.log("start update scores");
            // console.log(newScores);
            manager.updateScores(newScores);
            return manager;
        })
}

// Build a list of Scores from a list of Games
function buildScores(games: Game[]): Score[] {
    console.log("buildScores start.....");
    // console.log(games);
    return games.map((game) => new Score(game));
}

// Updates the ticker in the Status Bar
export function updateTicker(manager: Manager): Manager {
    console.log("updateTicker start......");
    manager.rollTicker();
    return manager;
}