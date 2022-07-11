import {
    executeHEADRequest,
    processAuthorization,
    processSchoolID,
    processWeekID,
    requestBaseData,
    sendError,
    sendJSON
} from '../../utils/http.js';
import {
    parseXML
} from '../../utils/xml.js';
import fetch from 'node-fetch';
import {
    readTimetable
} from './format/timetable.js';
import {
    readWeeks
} from './format/base-data.js';
import {
    APIDate
} from '../../utils/date.js';

export function getRequestURL(school, week) {
    return `https://www.stundenplan24.de/${school}/wplan/wdatenk/SPlanKl_Sw${week}.xml`;
}

export default async (req, res) => {
    const authorization = processAuthorization(req, res);
    if (authorization === null)
        return;

    const school = processSchoolID(req, res);
    if (school === null)
        return;

    const week = processWeekID(req, res);
    if (week === null)
        return;

    if (week !== -1) {
        const firstTryCode = await executeHEADRequest(getRequestURL(school, week), authorization);

        if (Math.floor(firstTryCode / 100) === 2) {
            const actualDataResponse = await fetch(getRequestURL(school, week), {
                method: 'GET',
                headers: {
                    authorization: authorization
                }
            });

            if (Math.floor(actualDataResponse.status / 100) !== 2) {
                sendError(res, actualDataResponse.status, 'Unexpected error.');
                return null;
            }

            const dataXML = await actualDataResponse.text();
            const parsedData = parseXML(dataXML);

            sendJSON(res, 200, readTimetable(parsedData));
            return;
        }

        if (firstTryCode === 401) {
            sendError(res, 401, 'Invalid credentials.');
            return;
        }
    }

    const baseData = await requestBaseData(authorization, school);
    if (baseData === null)
        return;

    const weeks = readWeeks(baseData, true).weeks
        .sort((a, b) => APIDate.compare(a.firstDay, b.firstDay));

    const startIndex = week === -1 ? 0 : weeks.findIndex(w => w.id === week);

    if (startIndex < 0) {
        sendError(res, 404, 'No timetable could be found for the specified week.');
        return;
    }

    for (let i = startIndex; i < weeks.length; i++) {
        const code = await executeHEADRequest(getRequestURL(school, weeks[i].id), authorization);

        if (Math.floor(code / 100) === 2) {
            const actualDataResponse = await fetch(getRequestURL(school, weeks[i].id), {
                method: 'GET',
                headers: {
                    authorization: authorization
                }
            });

            if (Math.floor(actualDataResponse.status / 100) !== 2) {
                sendError(res, actualDataResponse.status, 'Unexpected error.');
                return null;
            }

            const dataXML = await actualDataResponse.text();
            const parsedData = parseXML(dataXML);

            sendJSON(res, 200, readTimetable(parsedData));
            return;
        }

        if (code === 401) {
            sendError(res, 401, 'Invalid credentials.');
            return;
        }
    }

    if (startIndex < 0) {
        sendError(res, 404, 'No timetable could be found for the specified week.');
        return;
    }
}