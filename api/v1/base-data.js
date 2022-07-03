import {
    processBaseData,
    processPartList,
    sendJSON
} from '../../utils/http.js';
import {
    read
} from './format/base-data.js';

export default async (req, res) => {
    const parsedResponse = await processBaseData(req, res);
    if (parsedResponse === null)
        return;

    const partList = processPartList(req, res);

    sendJSON(res, 200, read(parsedResponse, partList));
};