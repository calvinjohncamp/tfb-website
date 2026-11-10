// Vollständige Übernahme der Vereinsseite am 10.11.2026.
// Quelle: https://www.tfbielstein.de/haeufig-gestellte-fragen/
(() => {
  const entries = [
  {
    "question": "Wie hoch muss das Netz in der Mitte des Platzes sein?",
    "answer": [
      "Das Netz sollte in der Mitte eine Höhe von 91,4cm haben. Wer kein Maßband hat, kann sich auch eine Einzelstütze zur Überprüfung nehmen. Dort ist meistens eine Markierung gesetzt. So könnt ihr auch die richtige Positionierung für die Einzelstützen herausfinden (91,4cm von der Einzelfeldaussenlinie)."
    ]
  },
  {
    "question": "Was ist, wenn die Heimmannschaft keine Einzelstützen hat?",
    "answer": [
      "Müssen wir antreten und welche Folgen hat es, wenn wir uns weigern?",
      "Die Regel Nr. 1 der ITF-Tennisregeln befasst sich mit dem Spielfeld und ermöglicht erst das regelgerechte Spielen, wenn das Spielfeld gemäß der Regel 1 entsprechend hergerichtet ist. Dazu gehören festgelegte Maße, Linien, Netzpfosten, das Netz usw. Es heißt hier aber auch:\n\nWird für Einzelspiele ein Netz für das Doppelfeld verwendet, muss das Netz auf einer Höhe von 1,07m von zwei Einzelstützen gestützt werden, deren Mitte auf jeder Seite 91,4cm außerhalb des Einzelspielfeldes liegt. Hiermit wird deutlich, dass dies keine Kannbestimmung ist.\n\nFazit: Ein Platz ohne Einzelstützen entspricht nicht den Vorschriften. Die Entscheidung der Sportkommission: Tritt ein Verein nicht an, wenn der Heimverein keine Einzelstützen hat, dann hat der Gastgeber tatsächlich mit dem Höchstergebnis verloren. Zusätzlich wird ein Ordnungsgeld in Höhe von 100,- Euro erhoben."
    ]
  },
  {
    "question": "Beim Mannschaftsspiel muss ich erst auf der Anlage sein, wenn mein Match beginnt!",
    "answer": [
      "Das ist falsch! Zu dem Zeitpunkt, an dem die Aufstellung eingetragen wird, müssen alle eingetragenen Spieler anwesend sein. Im schlimmsten Fall heißt das: Wenn die Nummer eins in den Spielberichtsbogen eingetragen wird, aber erst einige Minuten später auf die Anlage kommt, so ist ein nicht spielberechtigter Spieler aufgestellt. Die Konsequenz: Sein Einzel und alle auf den nachfolgenden Positionen gehen verloren. Die Bekanntgabe der Mannschaftsaufstellung muss übrigens 15 Minuten vor dem angesetzten Spielbeginn erfolgen.\n\nFür das Doppel gilt diese Regelung analog: Wer im Doppel aufgestellt wird (die Aufstellung erfolgt spätestens 15 Minuten nach dem Ende des letzten Einzels), der muss zu diesem Zeitpunkt anwesend sein. Ein Spieler, der nur im Doppel eingesetzt wird, muss daher auch erst zur Doppel-Aufstellung anwesend sein."
    ]
  },
  {
    "question": "Ein Spieler hat sich im Einzel verletzt. Darf er noch im Doppel antreten?",
    "answer": [
      "Ja, wenn er mindestens einen Punkt im Einzel gespielt hat. Also es 0:15 oder 15:0 steht. Verletzt er sich beim Einschlagen, darf er kein Doppel mehr spielen."
    ]
  },
  {
    "question": "Beim Mannschaftsspiel darf ich gecoacht werden!",
    "answer": [
      "Das ist natürlich richtig, allerdings unterliegt das Coaching einigen klaren Regeln: Beraten werden darf nur während der Spielpausen, also nach Satzende und bei den Seiten-wechseln mit Pause, nicht aber bei den Seitenwechseln nach dem ersten Spiel im Satz oder während eines Tie-Breaks und schon gar nicht zwischen zwei Punkten. Coachen darf jeder, den ich als Betreuer auf der Bank haben will, aber immer nur eine Person. Die einzige Ausnahme gilt hier für den Mannschaftsführer: Er darf zusätzlich zum Coach auf der Bank sitzen.\n\nUnd damit kommen wir auch schon zur nächsten „Coaching-Regel“: Die Beratung darf nur auf dem Platz erfolgen, nicht aber von außerhalb, zum Beispiel hinter der Bank über den Zaun hinweg. Das ist in manchen Fällen sicher etwas kleinlich, andererseits sollte es auch kein großes Problem sein, sich an diese Regel zu halten."
    ]
  },
  {
    "question": "Was passiert mit dem Aufschlag- und Seitenwahlergebnis, wenn das Einspielen z.B. aufgrund der Witterung unterbrochen wurde?",
    "answer": [
      "Der Sieger des Losentscheides bleibt bestehen. Aber beide Spieler dürfen neu wählen, da sich in der Zwischenzeit die Wahl beeinflussende Bedingungen, wie beispielsweise der Sonnenstand oder die Windrichtung, geändert haben können. Der Gewinner der Auslosung kann dann z.B. die erste Entscheidung seinem Gegner überlassen."
    ]
  },
  {
    "question": "Was passiert, wenn ein Aufschlag im Einzel (Doppel) die Einzelstütze (den Netzpfosten) trifft und von da aus im richtigen Aufschlagfeld landet?",
    "answer": [
      "Aufschlagfehler. Trifft der Ball hingegen während des Ballwechsels die Einzelstütze und landet im korrekten Feld, so ist dies kein Fehler und der Ballwechsel geht regulär weiter"
    ]
  },
  {
    "question": "Wer kann einen Fußfehler entscheiden?",
    "answer": [
      "Ein Fußfehler kann ausschließlich von einem Stuhlschiedsrichter oder einem sich auf dem Platz befindenden Oberschiedsrichter gerufen und entschieden werden. Stellt ein Spieler beim Spiel ohne Schiedsrichter fest, dass sein Gegner sehr deutliche Fußfehler macht, so ist ein Hinweis beim nächsten Seitenwechsel angemessen."
    ]
  },
  {
    "question": "Berühre ich das Netz, ist der Punkt weg!",
    "answer": [
      "Grundsätzlich richtig, solange der Ball noch im Spiel ist! Also selbst wenn ich einen Schmetterball so schlage, dass er aufspringt und sich in hohem Bogen auf dem Weg auf das Clubhausdach befindet: Berühre ich das Netz (mit Körper, Schläger oder Kleidung), bevor der Ball ein zweites Mal aufgesprungen ist oder eine ständige Einrichtung (Bank, Schiedsrichterstuhl, Zaun) oder etwas nicht zum Platz Gehörendes (zum Beispiel das Clubhausdach) berührt hat, dann verliere ich den Punkt. Wichtig ist dabei aber noch zu wissen, welcher Teil des Netzes tatsächlich zum Netz gehört! Denn: Im Einzel mit einer Singlestütze gehört der Bereich zwischen der Stütze und dem Netzpfosten nicht zum Netz, sondern gilt als ständige Einrichtung. Und diese darf ich sehr wohl berühren."
    ]
  },
  {
    "question": "Ich darf nicht über das Netz langen!",
    "answer": [
      "Das ist nicht richtig. Was ich nicht darf: den Ball schlagen, bevor er das Netz überquert hat! Ist der Ball aber auf meiner Seite und ich schwinge mit dem Schläger über das Netz hinweg aus (ohne es zu berühren oder den Gegner zu behindern!), dann ist das vollkommen korrekt. Sollte ein Ball so stark angeschnitten sein, dass er auf meiner Seite auf tippt und dann wieder über das Netz zurückspringt, dann darf ich den Ball sogar auf der anderen Seite des Netzes noch schlagen (natürlich nur, bevor er dort aufgesprungen ist, sonst gewinnt der Gegner den Punkt)."
    ]
  },
  {
    "question": "Beim Return darf ich stehen, wo ich will!",
    "answer": [
      "Das ist grundsätzlich richtig, solange ich nicht im Feld meines Gegners stehe. Ansonsten kann ich meine Position als Returnspieler frei wählen. Wenn mein Partner im Doppel mit dem Return an der Reihe ist, darf ich sogar mitten im Aufschlagfeld stehen. (Was allerdings nicht besonders klug ist, da es erstens recht schmerzhaft sein kann, und zweitens in diesem Fall auch der Punkt weg ist. Das gilt übrigens auch, wenn ich irgendwo anders stehe und vom gegnerischen Aufschlag direkt getroffen werde).\n\nWas ich als Returnspieler (und insbesondere als Partner des Returnspielers im Doppel) nicht machen darf: extrem herumzappeln oder gar mit dem Fußaufstampfen, wenn der Gegner gerade in der Aufschlagbewegung ist. Natürlich muss ich nicht wie eine Statue auf meiner Position verharren. Wenn aber meine Bewegungen nur darauf abzielen, den Gegner zu irritieren und zu stören, dann gilt dies als absichtliche Behinderung und ist nicht zulässig."
    ]
  },
  {
    "question": "Gibt es eine Punktwiederholung (1.Aufschlag) wenn zwischen dem 1. und 2. Aufschlag ein Ball vom Nachbarplatz auf das Spielfeld rollt?",
    "answer": [
      "Rollt zwischen dem 1. und 2. Aufschlag ein Ball auf das Feld, so führt das nicht zu einem erneuten 1. Aufschlag (Punktwiederholung). Auch dann nicht, wenn einer der Spieler seine Position verlassen muss, um den Ball aus dem Spielfeld zu entfernen. Eine Punktwiederholung gibt es nur dann, wenn der Aufschläger seine bereits begonnene Aufschlagbewegung aufgrund eines äußeren Störfaktors (z.B. hereinrollender Ball) unterbrechen muss."
    ]
  },
  {
    "question": "Während eines Ballwechsels, bei dem die Flugbahn des Balls nach Berühren der Netzkante plötzlich verändert wird, macht der Spieler A beim Volley einen unabsichtlichen Doppelschlag. Sein Gegner B kann den Ball nicht mehr erreichen und reklamiert den Punkt für sich.",
    "answer": [
      "Punkt für Spieler A, da ein unabsichtlicher Doppelschlag regelkonform ist."
    ]
  },
  {
    "question": "Was passiert, wenn einem Spieler während des Ballwechsels ein Ball aus der Tasche fällt oder die Kopfbedeckung ungewollt auf den Platz fliegt?",
    "answer": [
      "Passiert ein Vorfall dieser Art zum ersten Mal in einem Match, so wird dies als unabsichtliche Behinderung des Gegners gewertet, sodass der Punkt wiederholt werden sollte. Bei jedem weiteren Vorfall dieser Art, ist zum Schutz des Gegners von einer absichtlichen Behinderung auszugehen, sodass der Punkt dem Gegner zugesprochen werden sollte."
    ]
  },
  {
    "question": "Gebe ich fälschlicherweise einen Ball aus, dann verliere ich den Punkt!",
    "answer": [
      "Hier kommt es auf den Bodenbelag an: Wenn ein Spieler zunächst „Aus!“ ruft, dann aber merkt, dass der Ball doch gut war, dann verliert er auf einem Sandplatz den Punkt. Auf Hartplätzen (zum Beispiel in der Halle) hingegen wird der Punkt wiederholt (es sei denn, es war ein direkter Gewinnschlag). Das gilt allerdings nur für das erste Mal, wenn so etwas in einem Match passiert. Danach verliert der Spieler auch hier den Punkt."
    ]
  },
  {
    "question": "Wenn ich einen Ball aus gebe, muss ich einen Abdruck zeigen können!",
    "answer": [
      "Das ist so nicht richtig. Häufig ist ein Abdruck zwischen vielen Fußabdrücken und anderen Spuren nicht zu finden. Zweifelt der Gegenüber dann die Entscheidung an, so ist im Ernstfall er in der „Beweispflicht“ und muss einen entsprechenden Abdruck zeigen."
    ]
  },
  {
    "question": "Mein Gegner darf nur mit meiner Erlaubnis auf meine Seite kommen!",
    "answer": [
      "Das ist grundsätzlich richtig. Allerdings darf ich meinem Gegner dies auch nicht verwehren, wenn er mich bittet, sich einen Abdruck anschauen zu dürfen. Die vorherige Frage ist quasi so etwas wie eine Geste der Höflichkeit."
    ]
  },
  {
    "question": "Ich entscheide auf meiner Seite, ob ein Ball aus ist?",
    "answer": [
      "Praxisbeispiel: Ein ballspielender Spieler gibt einen Ball, der knapp hinter der Linie aufgekommen ist, „aus“. Der Gegenspieler bezweifelt dessen Entscheidung und bittet ihn, ihm den Abdruck zu zeigen, denn er meint, einen Abdruck, der die Linie berührt hatte, gesehen zu haben. Der ballspielende Spieler stimmt einer Besichtigung zu (ohne dessen Zustimmung darf man die Gegenseite nicht betreten, das ist ausdrücklich untersagt). Der Gegenspieler zeigt ihm einen Abdruck, der tatsächlich die Linie berührt hat. Es ist somit eine Pattsituation entstanden, jeder hat seinen eigenen Abdruck und ist sich sicher, im Recht zu sein. Beide können sich nicht einigen, welcher Ballabdruck nun der richtige ist, und entscheiden auf „zwei Neue“ – ist das richtig?",
      "Auflösung: Nein, der Punkt muss an den ballspielenden Spieler gehen, er hatte die Entscheidungshoheit und hat auf Aus entschieden, denn jeder entscheidet auf seiner Seite. Allerdings kann ich verstehen, dass, wenn sich beide Seiten unsicher sind, der Punkt neu ausgespielt wird, aber nach den ITF-Regeln ist die Entscheidung auf „zwei Neue“ falsch."
    ]
  },
  {
    "question": "Spiele ich den Ball zurück, darf ich ihn nicht mehr aus geben!",
    "answer": [
      "Das stimmt nur bedingt: Ein Ausruf muss direkt nach dem Aufspringen des Balls erfolgen. Ein sogenannter „Reflexschlag“ ist jedoch erlaubt. Das heißt, dass ich den Ball zwar noch schlage, dann aber direkt „Aus!“ rufen muss. Auf Sand geht es sogar noch etwas weiter: Hier darf ich den Ball zunächst zurückspielen und ihn erst nach Blick auf den Abdruck aus geben. Wichtig ist hierbei: Ich darf den Punkt nach dem Reflexschlag nicht weiter spielen. Und als weitergespielt gilt es schon, wenn ich mich zum nächsten Schlag des Gegners hin orientiere oder gar versuche, ihn zu erreichen."
    ]
  },
  {
    "question": "Ich darf mit gerissener Saite weiterspielen!",
    "answer": [
      "Das kommt darauf an: Wenn die Saite mitten im Punkt reißt, dann darf ich den Punkt natürlich zu Ende spielen und muss anschließend den Schläger wechseln. Das Gleiche gilt, wenn die Saite beim ersten Aufschlag reißt: Ich darf den zweiten Aufschlag und den folgenden Punkt mit der gerissenen Saite spielen. Und auch wenn der erste Aufschlag meines Gegners im Aus ist und mir beim Schlagen dieses Balles die Saite reißt, darf ich mit der gerissenen Saite diesen einen Punkt spielen. In diesem Fall muss der Gegner den zweiten Aufschlag spielen. Wenn ich mich jedoch entscheide, den Schläger zu wechseln, so hat der Gegner wieder ersten Aufschlag."
    ]
  },
  {
    "question": "Ist ein Ball kaputt, gibt’s zwei Neue!",
    "answer": [
      "Hierbei muss man zwei Dinge unterscheiden: Ist der Ball nur weich oder ist er kaputt beziehungsweise „gebrochen“, wie es im Fachjargon heißt. „Gebrochen“ bedeutet, dass der Ball keine Luft mehr hat und sich so sehr eindrücken lässt, dass sich die Innenseiten des Balles berühren. Ist dies der Fall, so wird der Punkt tatsächlich wiederholt. Ist der Ball hingegen nur weich, so bleibt der gespielte Punkt bestehen. Ausgetauscht wird der Ball übrigens in beiden Fällen."
    ]
  },
  {
    "question": "Gespielte Punkte werden nicht wiederholt!",
    "answer": [
      "Das ist grundsätzlich richtig. Selbst wenn von der falschen Seite oder der falschen Platzhälfte aufgeschlagen wurde oder gar der falsche Spieler serviert hat – gespielte Punkte bleiben bestehen"
    ]
  },
  {
    "question": "Falsche Reihenfolgen müssen sofort korrigiert werden!",
    "answer": [
      "Richtig! Wenn beim ersten Punkt (oder den ersten Punkten) eines Spiels der falsche Spieler aufschlägt, so muss dies sofort korrigiert werden, nachdem der Fehler entdeckt wurde. Im schlimmsten Fall kann es also passieren, dass mein Gegner bis zum 40:0 aufschlägt und dann festgestellt wird, dass eigentlich ich hätte aufschlagen müssen. In diesem Fall muss ich weiter aufschlagen und habe plötzlich drei Breakbälle gegen mich. Das klingt im ersten Moment unfair. Allerdings habe ich den Fehler selbst ja auch nicht bemerkt, habe mir die Suppe also zum großen Teil selbst mit eingebrockt.\n\nEine Ausnahme gibt es im Doppel: Wenn mein Partner von rechts returniert, obwohl ich eigentlich hätte rechts stehen müssen, dann bleibt diese Aufstellung für den Rest dieses einen Returnspiels bestehen. Erst im nächsten Returnspiel müssen wir uns wieder richtig aufstellen."
    ]
  },
  {
    "question": "Während der Ausführung des 2. Aufschlages rutscht dem Aufschläger der Schläger aus der Hand und landet – ohne das Netz zu berühren – zwei Meter vor der eigenen Aufschlaglinie. Der Rückschläger ist von dem anfliegenden Schläger so überrascht, dass er den Aufschlag nicht ins Feld zurückspielen kann. Sein Rückschlag geht ins Netz. Wie ist die richtige Entscheidung?",
    "answer": [
      "Punkt für den Aufschläger, da man davon ausgeht, dass das Verlieren des Schlägers mehr Vorteil als Behinderung für den Gegner ist und in diesem Fall der Rückschlag im Netz gelandet ist."
    ]
  },
  {
    "question": "Muss ein Spieler vor Beginn eines Punktes einen in seinem Feld liegenden Ball auf Bitten seines Gegners entfernen?",
    "answer": [
      "Nein. Auch hier gilt, dass jeder Spieler für seine eigene Seite verantwortlich ist."
    ]
  },
  {
    "question": "Wie viel Zeit hat ein Spieler zwischen zwei Punkten?",
    "answer": [
      "Der Aufschläger hat 25 Sekunden zwischen dem Ende des letztgespielten Punktes und dem Beginn der Aufschlagbewegung für den nächsten Punkt. Dem Rückschläger stehen diese 25 Sekunden nicht zur Verfügung. Er hat sich nach dem angemessenen Tempo des Aufschlägers zu richten. Als angemessen gelten Zeiten ab etwa 10 Sekunden."
    ]
  },
  {
    "question": "Wie viele Dämpfer und an welcher Stelle dürfen Dämpfer am Schläger platziert werden?",
    "answer": [
      "Solange sie im äußersten Saitenmuster platziert werden, dürfen beliebig viele Dämpfer genutzt werden"
    ]
  },
  {
    "question": "Wie ist zu verfahren, wenn sich Spieler uneinig über den aktuellen Spielstand sind?",
    "answer": [
      "Sind sich zwei Spieler uneinig über den Spielstand, so sollen die gespielten Punkte gemeinsam rekonstruiert werden. Alle Punkte über die Einigkeit besteht, bleiben bestehen. Dazu folgendes Beispiel:\n\nDer Oberschiedsrichter wird zum Platz gerufen, da Spieler A der Meinung ist, der Spielstand wäre 40:30, aber Spieler B behauptet der Spielstand wäre 30:40. Nachdem alle Punkte nachvollzogen worden sind, stellt sich heraus, dass Uneinigkeit über den zweiten Punkt des Spieles besteht. Darüber, dass beide Spieler jeweils zwei Punkte gewonnen haben, herrscht Einigkeit. Somit wird das Spiel beim Spielstand von 30:30 fortgesetzt und der nächste\n\nAufschlag erfolgt von der Einstandseite."
    ]
  }
];
  TFB.rulebook = {
    render({ esc, paragraphs }) {
      return `<section class="sport-rulebook" aria-labelledby="rulebook-title">
        <h2 id="rulebook-title">Regelwerk</h2>
        <p class="muted">Häufige Fragen zum Tennisspiel und zum Mannschaftswettbewerb.</p>
        <div class="rulebook-questions">${entries.map((entry, index) => `<details class="rulebook-question" id="regel-${index + 1}">
          <summary>${esc(entry.question)}</summary>
          <div class="rulebook-answer">${entry.answer.map(paragraphs).join('')}</div>
        </details>`).join('')}</div>
        <p class="rulebook-source muted small">Übernommen aus <a href="https://www.tfbielstein.de/haeufig-gestellte-fragen/" target="_blank" rel="noopener noreferrer">Häufige Fragen und Regelwerk · Tennisfreunde Bielstein</a>.</p>
      </section>`;
    },
  };
})();
