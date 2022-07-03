import {
    executeHEADRequest,
    processAuthorization,
    processIntegerID,
    processWeekID,
    sendJSON
} from '../../utils/http.js';
import {
    parseXML
} from '../../utils/xml.js';
import fetch from 'node-fetch';
import { readTimetable } from './format/timetable.js';

export function getRequestURL(school, week) {
    return `https://www.stundenplan24.de/${school}/wplan/wdatenk/SPlanKl_Sw${week}.xml`;
}

export default async (req, res) => {
    const authorization = processAuthorization(req, res);
    if (authorization === null)
        return;

    const id = processIntegerID(req, res);
    if (id === null)
        return;

    const week = processWeekID(req, res);
    if (week === null)
        return;

    if (week !== -1) {
        const firstTryCode = await executeHEADRequest(getRequestURL(id, week), authorization);

        if (Math.floor(firstTryCode / 100) === 2) {
            const actualDataResponse = await fetch(getRequestURL(id, week), {
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
}