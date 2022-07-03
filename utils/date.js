class APIDate {
    year;
    month;
    day;

    constructor(y, m, d) {
        this.year = y;
        this.month = m;
        this.day = d;
    }

    toString() {
        const year = this.year.toString().padStart(4, '0');
        const month = this.month.toString().padStart(2, '0');
        const day = this.day.toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}

export function parse6CharDate(date) {
    return new APIDate(
        2000 + parseInt(date.substring(0, 2)),
        parseInt(date.substring(2, 4)),
        parseInt(date.substring(4, 6)));
}

export function parseDotSeparatedDate(date) {
    const split = date.split('.');

    return new APIDate(
        parseInt(split[2]),
        parseInt(split[1]),
        parseInt(split[0]));
}