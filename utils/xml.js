import {
    xml2js
} from 'xml-js';

export function parseXML(xml) {
    return xml2js(xml, {
        compact: true,
        attributesKey: '$',
        textKey: '_'
    });
}