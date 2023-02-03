import Manager from "./models/Manager";
import Game from "./models/Game";
import Score from "./models/Score";
import { fetchGames } from "./api/soccer";

export function fetchScores(manager: Manager): Promise<Manager> {
    //const teamFilter = config("teamFilter") || [];
    return fetchGames()
        .then((games) => {
            console.log("In fetchScores, games: ");
            const result : Game[] = [];
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