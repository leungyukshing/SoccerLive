import Team from "./Team";

export default interface Game {
    id: number,
    leagueId: number,
    leagueCode: string,
    leagueName: string,
    home: Team,
    away: Team,
    statusId: number,
    tournamentStage?: string,
    timeTS: number,
}