import {
    processBaseData,
    sendJSON
} from '../../utils/http.js';
import {
    readDataRanges
} from './format/base-data.js';

export default async (req, res) => {
    const parsedResponse = await processBaseData(req, res);
    if (parsedResponse === null)
        return;

    sendJSON(res, 200, readDataRanges(parsedResponse));
};