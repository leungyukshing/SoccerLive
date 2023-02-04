import Team from "./Team";
import Status from "./Status";

export default interface Game {
    id: number,
    leagueId: number,
    leagueCode: string,
    leagueName: string,
    home: Team,
    away: Team,
    status: Status,
    timeTS: number,
}