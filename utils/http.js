import fetch from 'node-fetch';
import {
    parseXML
} from './xml.js';

export function sendJSON(res, code, json) {
    res.setHeader('Content-Type', 'application/json');
    res.status(code);
    res.write(JSON.stringify(json));
    res.end();
}

export function sendError(res, code, message) {
    sendJSON(res, code, {
        errorMessage: message,
        errorCode: code
    });
}

export function processAuthorization(req, res) {
    const user = req.query.user;
    const password = req.query.password;

    if (!user || !password) {
        const headerAuthorization = req.headers.authorization;
        if (!headerAuthorization) {
            sendError(res, 401, 'Missing or invalid credentials.');
            return null;
        }
        return headerAuthorization;
    }

    return `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`;
}

export function processSchoolID(req, res) {
    const id = parseInt(req.query.school);

    if (isNaN(id)) {
        sendError(res, 400, 'Missing or invalid school id.');
        return null;
    }

    return id;
}

export async function processBaseData(req, res) {
    const authorization = processAuthorization(req, res);
    if (authorization === null)
        return null;

    const school = processSchoolID(req, res);
    if (school === null)
        return null;

    const requestURL = `https://www.stundenplan24.de/${school}/wplan/wdatenk/SPlanKl_Basis.xml`;

    const response = await fetch(requestURL, {
        method: 'GET',
        headers: {
            authorization: authorization
        }
    });

    if (response.status === 401) {
        sendError(res, 401, 'Invalid credentials.');
        return null;
    } else if (Math.floor(response.status / 100) !== 2) {
        sendError(res, response.status, 'Unexpected error.');
        return null;
    }

    const responseXML = await response.text();
    const parsedResponse = parseXML(responseXML);

    return parsedResponse;
}

export function processPartList(req, res) {
    let parts = req.query.part;

    if (parts === null || parts === undefined)
        return [];

    if (!Array.isArray(parts))
        parts = [parts];

    return parts;
}

export function processWeekID(req, res) {
    if (!req.query.week)
        return -1;

    const id = parseInt(req.query.week);

    if (isNaN(id)) {
        sendError(res, 400, 'Invalid week id.');
        return null;
    }

    return id;
}

export async function executeHEADRequest(url, authorization){
    const response = await fetch(url, {
        method: 'HEAD',
        headers: {
            authorization: authorization
        }
    });

    return response.status;
}