export default class Detail {
    team: number;
    player: string;
    time: number;
    type: string;
    desc: string;

    constructor(team: number, name: string, time: number, type: string, desc: string) {
        this.team = team;
        this.player = name;
        this.time = time;
        this.type = type;
        this.desc = desc;
    }
}