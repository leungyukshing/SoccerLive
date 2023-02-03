export default interface Status {
    utcTime: Date,
    started: boolean,
    cancelled: boolean,
    finished: false;
    liveTime: {short: string, long: string};
}