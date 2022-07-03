import {
    parse6CharDate,
    parseDotSeparatedDate
} from '../../../utils/date.js';
import {
    isEmptyObject
} from '../../../utils/common.js';

export const READERS = {
    'school': readSchool,
    'daysOff': readDaysOff,
    'dataRanges': readDataRanges,
    'weeks': readWeeks,
    'classes': readClasses
};

export function readSchool(data) {
    return {
        school: {
            name: data.splan.Kopf.schulname._,
            location: data.splan.Kopf.schulort._
        }
    };
}

export function readDaysOff(data) {
    return {
        daysOff: data.splan.FreieTage.ft.map(d => {
            return {
                date: parse6CharDate(d._).toString(),
                isHoliday: d.$ !== null && d.$ !== undefined && d.$.feier === '1' ? true : undefined
            };
        })
    };
}

export function readDataRanges(data) {
    return {
        dataRanges: {
            firstDay: parseDotSeparatedDate(data.splan.Basisdaten.BaDatumVon._).toString(),
            lastDay: parseDotSeparatedDate(data.splan.Basisdaten.BaDatumBis._).toString(),
            firstWeek: parseInt(data.splan.Basisdaten.BaSwVon._),
            lastWeek: parseInt(data.splan.Basisdaten.BaSwBis._),
            daysPerWeek: parseInt(data.splan.Basisdaten.BaTageProWoche._)
        }
    };
}

export function readWeeks(data) {
    return {
        weeks: data.splan.Schulwochen.Sw.map(w => {
            return {
                id: parseInt(w._),
                type: w.$.SwWo,
                firstDay: parseDotSeparatedDate(w.$.SwDatumVon).toString(),
                lastDay: parseDotSeparatedDate(w.$.SwDatumBis).toString(),
                weekOfYear: parseInt(w.$.SwKw)
            };
        })
    };
}

export function readClasses(data) {
    return {
        classes: data.splan.Klassen.Kl.map(c => {
            return {
                name: c.Kurz._,
                password: isEmptyObject(c.Hash) ? undefined : {
                    md5: c.Hash._
                }
            };
        })
    };
}

export function read(data, names) {
    let result = {};
    for (const name of names)
        if (READERS[name])
            result = {
                ...result,
                ...READERS[name](data)
            };
    return result;
}