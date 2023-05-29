import Manager from "./models/Manager";
import Game from "./models/Game";
import Score from "./models/Score";
import { fetchGames } from "./api/soccer";
import { config } from "./extension";

export function fetchScores(manager: Manager): Promise<Manager> {
    // TODO: validate setting and use default
    var leaguesStr = config("includedLeague");
    // console.debug("leaguesStr: " + leaguesStr);
    var leagueArr = leaguesStr.split(",");
    // console.debug(leagueArr);
    leagueArr.forEach((val: string, index: any) => {
        leagueArr[index] = +(val.trim());
    });
    leagueArr = leagueArr.filter(function(str: string) {
        return str !== "";
    });

    // console.debug(leagueArr);

    return fetchGames()
        .then((games) => {
            console.log("In fetchScores, games: ");
            var result : Game[] = [];
            games.forEach((game) => {
                result.push(...game);
            });
            // console.debug(result);
            result = result.filter(function(item) {
                
                // console.debug(leagueArr);
                // 42 -> Champions League
                // 47 -> Premier League
                // 87 -> LaLiga
                // 54 -> Bundesliga
                return leagueArr.includes(item.leagueId); // filter matches based on configurationq
            });
            
            result = result.filter(function(item) {
                // filter live matches
                return item.status.started && !item.status.finished;
            });
            // console.debug(result);
            return buildScores(result);
        })
        .then((newScores) => {
            console.log("start update scores");
            // console.debug(newScores);
            manager.updateScores(newScores);
            return manager;
        });
}

// Build a list of Scores from a list of Games
function buildScores(games: Game[]): Score[] {
    console.debug("buildScores start.....");
    // console.debug(games);
    return games.map((game) => new Score(game));
}

// Updates the ticker in the Status Bar
export function updateTicker(manager: Manager): Manager {
    console.debug("updateTicker start......");
    manager.rollTicker();
    return manager;
}