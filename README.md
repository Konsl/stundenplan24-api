# stundenplan24-api
*Projekt, um herauszufinden, wie die API von Stundenplan42.de funktioniert*

**Wichtig: Stundenplan24.de verwendet mehrere API-Instanzen.
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
(gerade die Stundenpläne sind wirklich zeitaufwändig, da man für jede Woche einzeln prüfen muss, ob es einen gibt)

## Die API selbst

Die API besitzt 3 Endpunkte. Es gibt den Endpunkt für Basisinformationen (Schulname etc.), den Endpunkt für Stundenpläne und den Endpunkt für Vertretungspläne.
Mehr dazu in [`ablauf.txt`](https://github.com/Konsl/stundenplan24-api/blob/main/ablauf.txt)

Es besteht für Schulen auch die Möglichkeit, die API nicht auf stundenplan24.de, sondern auf der eigenen Webseite bereitzustellen.
Für diese Fälle gibt es eine separate Liste, die zu jeder Schul-ID angibt, unter welcher URL die API aufgerufen werden kann. (wird z.B. von der App VpMobil24 verwendet)

### Probleme der API und der Wochenplan-Webseite

- **API unterstützt keine Daten-Komprimierung**
  HTTP bietet die Möglichkeit, Antwortdaten (z.B. mit gzip) zu komprimieren. Diese Funktion wird von den meisten Browsern und Servern unterstützt,
  von Stundenplan24.de jedoch nicht. Mit Unterstützung dieser Funktion könnte im Fall von Stundenplan24.de die Menge der übertragenen Daten
  (und vermutlich, damit verbunden, die Ladezeit der Webseite) um ca. 95 % reduziert werden.
- **Daten werden mehrfach abgerufen**
  Beim Laden der Wochenplan-Webseite ruft diese über die API bestimmte Inhalte, wie die Basisinformationen, die Stundenpläne oder die Vertretungspläne ab.
  Dabei werden bestimmte Daten doppelt abgerufen, was die übertragene Datenmenge und die beanspruchte Ladezeit ebenfalls verdoppelt.
- **404-Seite wird vielfach abgerufen**
  Beim Laden der Wochenplan-Webseite wird für jede Schulwoche eine Anfrage ausgeführt, um zu überprüfen, ob es für diese einen eigenen Stundenplan gibt.
  (andernfalls wird der Stundenplan der Vorwoche verwendet) Gibt es keinen eigenen Stundenplan (was normalerweise der Fall ist),
  sendet der Server trotzdem Antwortdaten, denn es wird der HTML-Quellcode der 404-Seite gesendet. Diese Daten werden von der Webseite,
  die die Anfrage gestartet hat, ignoriert und demnach völlig umsonst übertragen. Eine Alternative wäre, `HEAD`-Requests statt `GET`-Requests zu verwenden,
  die genau wie `GET`-Requests funktionieren, die Antwortdaten aber nicht sendet. (diese Lösung ist immer noch nicht optimal, siehe nächster Anstrich)
- **Für jede Schulwoche wird eine eigene HTTP-Anfrage ausgeführt**
  Beim Laden der Wochenplan-Webseite wird für jede Schulwoche eine Anfrage ausgeführt, um zu überprüfen, ob es für diese einen eigenen Stundenplan gibt.
  Stattdessen könnte in jedem Schulwochen-Eintrag ein Attribut eingefügt werden, welches aussagt, dass es für diese Schulwoche einen Stundenplan gibt.
  So könnte die Ladezeit um ein Vielfaches verringert werden.

***Dieses Projekt ist weder von der Kannenberg Software GmbH autorisiert, noch wird es von ihr unterstützt.***
