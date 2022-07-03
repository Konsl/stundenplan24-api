import {
    parseColonSeparatedTime
} from "../../../utils/time.js";
import {
    decode
} from 'html-entities';

export function readTimetable(data) {
    return {
        classes: Object.assign({},
            ...data.splan.Klassen.Kl.map(c => {
                return {
                    [c.Kurz._]: {
                        lessons: c.Stunden && c.Stunden.St ? c.Stunden.St
                            .filter(l => l.$ && l.$.StZeit && l.$.StZeitBis)
                            .map(l => {
                                return {
                                    id: parseInt(l._),
                                    begin: parseColonSeparatedTime(l.$.StZeit).toString(),
                                    end: parseColonSeparatedTime(l.$.StZeitBis).toString()
                                };
                            }) : [],
                        blockedLessons: c.Sperrungen && c.Sperrungen.Sp ? c.Sperrungen.Sp
                            .map(b => {
                                return {
                                    day: parseInt(b.$.SpTg) - 1,
                                    lesson: parseInt(b.$.SpSt)
                                };
                            }) : [],
                        timetable: c.Pl && c.Pl.Std ? c.Pl.Std
                            .reduce((t, l) => {
                                const day = parseInt(l.PlTg._) - 1;
                                const lesson = parseInt(l.PlSt._);
                                const entry = {
                                    subject: decode(l.PlFa._),
                                    class: decode(l.PlKl._),
                                    teacher: decode(l.PlLe._),
                                    room: decode(l.PlRa._),
                                    course: l.PlKu !== null && l.PlKu !== undefined && l.PlKu._ ? l.PlKu._ : undefined,
                                    week: l.PlWo !== null && l.PlWo !== undefined && l.PlWo._ ? l.PlWo._ : undefined
                                };

                                if (!t[day][lesson])
                                    t[day][lesson] = entry;
                                else if (Array.isArray(t[day][lesson]))
                                    t[day][lesson].push(entry);
                                else
                                    t[day][lesson] = [t[day][lesson], entry];

                                return t;
                            }, Array.from({
                                length: parseInt(data.splan.Basisdaten.BaTageProWoche._)
                            }, () => [])) : []
                    }
                };
            }))
    };
}