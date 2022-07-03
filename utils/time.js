class APITime {
    hour;
    minute;

    constructor(h, m) {
        this.hour = h;
        this.minute = m;
    }

    toString() {
        const hour = this.hour.toString().padStart(2, '0');
        const minute = this.minute.toString().padStart(2, '0');

        return `${hour}:${minute}`;
    }
}

export function parseColonSeparatedTime(time) {
    const split = time.split(':');

    return new APITime(
        parseInt(split[0]),
        parseInt(split[1]));
}