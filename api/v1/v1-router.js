import {
    Router
} from 'express';

import test from './test.js';
import school from './school.js';
import daysOff from './days-off.js';
import dataRanges from './data-ranges.js';
import weeks from './weeks.js';
import classes from './classes.js';
import baseData from './base-data.js';
import timetable from './timetable.js';

const apiV1Router = Router();

apiV1Router.get('/test', test);
apiV1Router.get('/school', school);
apiV1Router.get('/daysOff', daysOff);
apiV1Router.get('/dataRanges', dataRanges);
apiV1Router.get('/weeks', weeks);
apiV1Router.get('/classes', classes);
apiV1Router.get('/baseData', baseData);

apiV1Router.get('/timetable', timetable);

export default apiV1Router;