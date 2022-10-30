# stundenplan24-api
*Projekt, um herauszufinden, wie die API von Stundenplan42.de funktioniert*

**Wichtig: Stundenplan24.de verwendet mehrere API-Endpunkte.
Von den mobilen Apps (sowohl online als auch im App Store und bei GooglePlay) wird die mobile API verwendet,
während der Online-Wochenplan die Wochenplan-API verwendet.
Dieses Projekt unterstützt ausschließlich die Wochenplan-API.**

## Ursprünglicher Plan

Die Anwendung sollte ein Webserver sein, der Daten von der Stundenplan42-API abruft, sie umstrukturiert und über die eigene API verfügbar macht.
Dieser kann dann ausgeführt werden, um andere Anwendungen zu unterstützen, die diese umstrukturierte API verwenden.

## Zukunft des Projektes

Die Implementierung ist bei weitem nicht vollständig und wird von mir (vermutlich) auch in Zukunft nicht weitergeführt,
da Zugriffe über diesen Webserver extrem viel mehr Zeit beanspruchen und deswegen keinen wirklichen Vorteil darstellen.

Stattdessen ist es vermutlich sinnvoller, die API von Stundenplan42 auf der Seite der Client-Anwendung zu implementieren.
Dabei ist es dann vermutlich sinnvoll, bestimmte Daten wie Stundenpläne zwischenzuspeichern, sodass sie nicht jedes mal neu geladen werde müssen.
(Gerade die Stundenpläne sind wirklich zeitaufwändig, da man für jede Woche einzeln prüfen muss, ob es einen gibt)

[`ablauf.txt`](https://github.com/Konsl/stundenplan24-api/blob/main/ablauf.txt)

Dieses Projekt ist weder von der Kannenberg Software GmbH autorisiert noch wird es von ihr unterstützt.
