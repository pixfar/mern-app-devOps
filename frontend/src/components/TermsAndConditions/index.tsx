import { FaDotCircle } from "react-icons/fa";

/* eslint-disable react/no-unescaped-entities */
const TermsAndConditions = () => {
  return (
    <div className="container mx-auto p-6 lg:p-12  ">
      <h1 className="text-3xl md:text-5xl font-extrabold text-center text-gray-800 dark:text-yellow-50">
        AGB
      </h1>
      {/* <p className="text-center text-gray-600 mt-2 dark:text-yellow-50">
        Last Updated: 20/05/2024
      </p> */}

      <div className="mt-10 space-y-8">
        {/* <section>
          <h4 className="text-2xl text-justify text-gray-700 leading-relaxed dark:text-black">
            Welcome to German LAW. These Terms and Conditions govern your use of
            our website and services. By accessing or using our platform, you
            agree to be bound by these terms. Please read them carefully.
          </h4>
        </section> */}

        <div className="space-y-8 grid md:grid-cols-1 ">
          {/* Section 1 */}
          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Geltungsbereich
            </h2>
            <p className="text-lg text-gray-700 dark:text-black">
              Für alle Lieferungen von meinjustus.de an Verbraucher gelten diese
              Allgemeinen Geschäftsbedingungen (AGB). <br />
              Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu
              einem Zwecke abschließt, der überwiegend weder ihrer gewerblichen
              noch ihrer selbstständigen beruflichen Tätigkeit zugerechnet
              werden kann.
            </p>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Vertragspartner
            </h2>
            <p className="text-lg text-gray-700 dark:text-black">
              Der Kaufvertrag kommt zustande mit CtrlE Consulting & Holding
              GmbH, Leitnerberg 14a, 4490 St. Florian, Österreich,
              Geschäftsführer: Philipp-Thomas Müller
            </p>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Vertragsschluss
            </h2>
            <ul className="text-lg text-gray-700 dark:text-black space-y-2">
              <li className="list-disc list-inside">
                Die Darstellung der Produkte im Online-Shop stellt kein
                rechtlich bindendes Angebot, sondern nur eine Aufforderung zur
                Bestellung dar.
              </li>
              <li className="list-disc list-inside">
                Durch Anklicken des Buttons „Jetzt buchen“ geben Sie eine
                verbindliche Bestellung der auf der Bestellseite aufgelisteten
                Waren ab. Ihr Kaufvertrag kommt zustande, wenn wir Ihre
                Bestellung durch eine Auftragsbestätigung per E-Mail unmittelbar
                nach dem Erhalt Ihrer Bestellung annehmen.
              </li>
            </ul>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Widerrufsrecht
            </h2>
            <ul className="text-lg text-gray-700 dark:text-black space-y-2">
              <li className="list-disc list-inside">
                Wenn Sie Verbraucher sind (also eine natürliche Person, die die
                Bestellung zu einem Zweck abgibt, der weder Ihrer gewerblichen
                oder selbständigen beruflichen Tätigkeit zugerechnet werden
                kann), steht Ihnen nach Maßgabe der gesetzlichen Bestimmungen
                ein Widerrufsrecht zu. Bitte beachten Sie, dass das
                Widerrufsrecht erlischt, wenn Sie durch einen Download auf
                meinjustus.de, die Leistung in Anspruch genommen haben.
              </li>
              <li className="list-disc list-inside">
                Machen Sie als Verbraucher von Ihrem Widerrufsrecht nach Ziffer
                4.1 Gebrauch, so haben Sie die regelmäßigen Kosten der
                Rücksendung zu tragen.
              </li>
              <li className="list-disc list-inside">
                Im Übrigen gelten für das Widerrufsrecht die Regelungen, die im
                Einzelnen wiedergegeben sind in der folgenden
                <p className="font-semibold my-3">
                  Widerrufsbelehrung Widerrufsrecht
                </p>
                <div>
                  Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von
                  Gründen diesen Vertrag zu widerrufen.
                  <br /> Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag an
                  dem Sie oder ein von Ihnen benannter Dritter, der nicht der
                  Beförderer ist, das Abonnement abgeschlossen hat.
                  <br /> Um Ihr Widerrufsrecht auszuüben, müssen Sie uns CtrlE
                  Consulting & Holding GmbH, Leitnerberg 14a, 4490 St. Florian,
                  Österreich, +43 660 5810753, sekretariat@meinjustus.de mittels
                  einer eindeutigen Erklärung (z.B. ein mit der Post versandter
                  Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag
                  zu widerrufen, informieren. Sie können dafür das beigefügte
                  Muster-Widerrufsformular verwenden, das jedoch nicht
                  vorgeschrieben ist.
                  <br /> Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie
                  die Mitteilung über die Ausübung des Widerrufsrechts vor
                  Ablauf der Widerrufsfrist absenden.
                </div>
                <p className="font-semibold my-3">Folgen des Widerrufs</p>
                <div>
                  Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle
                  Zahlungen, die wir von Ihnen erhalten haben, einschließlich
                  der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die
                  sich daraus ergeben, dass Sie eine andere Art der Lieferung
                  als die von uns angebotene, günstigste Standardlieferung
                  gewählt haben), unverzüglich und spätestens binnen vierzehn
                  Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über
                  Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für
                  diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das
                  Sie bei der ursprünglichen Transaktion eingesetzt haben, es
                  sei denn, mit Ihnen wurde ausdrücklich etwas anderes
                  vereinbart; in keinem Fall werden Ihnen wegen dieser
                  Rückzahlung Entgelte berechnet.
                </div>
                <p className="font-semibold my-3">
                  - Ende der Widerrufsbelehrung –
                </p>
              </li>
              <li className="list-disc list-inside">
                Über das Muster-Widerrufsformular informiert meinjustus.de nach
                der gesetzlichen Regelung wie folgt:
                <p className="font-semibold my-3">Muster-Widerrufsformular</p>
                <div>
                  (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte
                  dieses Formular aus und senden Sie es zurück.)
                </div>
                <div>
                  - An CtrlE Consulting & Holding GmbH, Leitnerberg 14a, 4490
                  St. Florian, Österreich, +43 660 5810753,
                  sekretariat@meinjustus.de <br /> –Hiermit widerrufe(n) ich/wir
                  (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf
                  der folgenden Waren (*)/die Erbringung der folgenden
                  Dienstleistung (*) <br /> –Bestellt am (*)/erhalten am (*){" "}
                  <br /> –Name des/der Verbraucher(s) <br /> –Anschrift des/der
                  Verbraucher(s)
                  <br /> –Unterschrift des/der Verbraucher(s) (nur bei
                  Mitteilung auf Papier) <br /> –Datum __________ <br />
                  (*) Unzutreffendes streichen
                </div>
              </li>
            </ul>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Preise und Versandkosten
            </h2>
            <ul className="text-lg text-gray-700 dark:text-black space-y-2">
              <li className="list-disc list-inside">
                Die auf den Produktseiten genannten Preise enthalten die
                gesetzliche Mehrwertsteuer und sonstige Preisbestandteile.
              </li>
            </ul>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Lieferung
            </h2>
            <ul className="text-lg text-gray-700 dark:text-black space-y-2">
              <li className="list-disc list-inside">
                Die Lieferung erfolgt als digitaler Download.
              </li>
              <li className="list-disc list-inside">
                Die Lieferzeit beträgt bis zu 3 Tage. Auf eventuell abweichende
                Lieferzeiten weisen wir auf der jeweiligen Produktseite hin.
              </li>
            </ul>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Zahlung
            </h2>
            <ul className="text-lg text-gray-700 dark:text-black space-y-2">
              <li className="list-disc list-inside">
                Die Zahlung erfolgt per Kreditkarte
              </li>
            </ul>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Eigentumsvorbehalt
            </h2>
            <p className="text-lg text-gray-700 dark:text-black">
              Bis zur vollständigen Zahlung bleibt die Ware unser Eigentum.
            </p>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Sachmägelgewährleistung
            </h2>
            <p className="text-lg text-gray-700 dark:text-black">
              meinjustus.de haftet für Sachmängel nach den hierfür geltenden
              gesetzlichen Vorschriften, insbesondere §§ 434 ff Bürgerliches
              Gesetzbuch.
            </p>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Streitbeilegung
            </h2>
            <p className="text-lg text-gray-700 dark:text-black">
              Die EU-Kommission hat eine Internetplattform zur Online-Beilegung
              von Streitigkeiten geschaffen. Die Plattform dient als
              Anlaufstelle zur außergerichtlichen Beilegung von Streitigkeiten
              betreffend vertragliche Verpflichtungen, die aus
              Online-Kaufverträgen erwachsen. Nähere Informationen sind unter
              dem folgenden Link verfügbar:{" "}
              <a
                href="http://ec.europa.eu/consumers/odr."
                target="_blank"
                className="text-secondary"
              >
                http://ec.europa.eu/consumers/odr.
              </a>{" "}
              Zur Teilnahme an einem Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle sind wir weder bereit noch
              verpflichtet.
            </p>
          </section>

          <section className="mt-8 border text-gray-700 dark:text-black text-xs md:text-14 border-slate-700 dark:border-slate-300 p-2 space-y-3">
            <p>
              <strong>Quelle</strong> : Online-Handel, Wegweiser durch die
              rechtlichen Rahmenbedingungen des E-Commerce unter
              Berücksichtigung des neuen Verbraucherrechts, von Rechtsanwalt Dr.
              Carsten Föhlisch/Trusted Shops GmbH und Rechtsanwalt Dr. Christian
              Groß/DIHK Deutscher Industrie-und Handelskammertag, DIHK Verlag,
              2.Auflage 2018 (
              <a
                href="www.dihk-verlag.de"
                target="_blank"
                className="text-primary"
              >
                www.dihk-verlag.de
              </a>
              )
            </p>
            <p>
              <strong>Hinweis:</strong> Die Veröffentlichung des Musters erfolgt
              mit freundlicher Genehmigung der Autoren. Widerrufsbelehrung und
              Widerrufsformular sind aktualisiert und entsprechen dem aktuellen
              Stand ab 28.05.2022 gemäß Anlage 1 und Anlage 2 zu Art. 246 a § 1
              Absatz 2 Satz 2 EGBGB.
            </p>
          </section>

          {/* <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Gewährleistungsfristen
            </h2>
            <p className="text-lg text-gray-700 dark:text-black">
              Bei Kauf- und Werkvertrag beträgt die Gewährleistungsfrist
              grundsätzlich 2 Jahre. Hat sich ein Mangel innerhalb der
              Verjährungsfrist gezeigt, so tritt die Verjährung nicht vor dem
              Ablauf von vier Monaten nach dem Zeitpunkt ein, in dem sich der
              Mangel erstmals gezeigt hat. Hat der Besteller zur Nacherfüllung
              oder zur Erfüllung von Ansprüchen aus einer Garantie die Ware an
              uns oder auf unsere Veranlassung einem Dritten übergeben, so tritt
              die Verjährung von Ansprüchen wegen des geltend gemachten Mangels
              nicht vor Ablauf von zwei Monaten nach dem Zeitpunkt ein, in dem
              die nachgebesserte oder ersetzte Ware dem Besteller übergeben
              wurde. Durch AGB kann unter Beachtung der unten genannten
              Informations- und Formvorschriften die Gewährleistungsfrist wie
              folgt verkürzt werden:
            </p>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center mb-2 gap-3">
              <FaDotCircle size={20} />
              Bewegliche Sachen außer Baumaterialien
            </h2>
            <div className="text-lg text-gray-700 dark:text-black terms-condition">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td>Neu</td>
                    <td>Käufer ist Verbraucher</td>
                    <td>Zwei Jahre</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Käufer ist Unternehmer</td>
                    <td>Ein Jahr </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Gebraucht</td>
                    <td>Käufer ist Verbraucher</td>
                    <td>Ein Jahr</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Käufer ist Unternehmer</td>
                    <td>Keine</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex mb-2 items-center gap-3">
              <FaDotCircle size={20} />
              Baumaterialien (sofern eingebaut):
            </h2>
            <div className="text-lg text-gray-700 dark:text-black  terms-condition">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td>Neu</td>
                    <td></td>
                    <td>Fünf Jahre</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Gebraucht</td>
                    <td>Käufer ist Verbraucher</td>
                    <td>Ein Jahr</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Käufer ist Unternehmer</td>
                    <td>Keine</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2 flex items-center gap-3">
              <FaDotCircle size={20} />
              Unbebaute Grundstücke:
            </h2>
            <div className="text-lg text-gray-700 dark:text-black terms-condition">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td>Bauwerke</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Neubau</td>
                    <td></td>
                    <td>Fünf Jahre</td>
                  </tr>
                  <tr>
                    <td>Altbau</td>
                    <td></td>
                    <td>Keine</td>
                  </tr>
                </tbody>
              </table>
              Die Vereinbarung über eine verkürzte Verjährung ist nur wirksam,
              wenn der Besteller vor der Abgabe seiner Vertragserklärung von der
              Verkürzung der Verjährungsfrist eigens in Kenntnis gesetzt wurde
              und die Verkürzung der Verjährungsfrist im Vertrag ausdrücklich
              und gesondert vereinbart wurde
            </div>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Mängelanzeigepflicht
            </h2>
            <p className="text-lg text-gray-700 dark:text-black">
              Für nicht offensichtliche Mängel darf die Mängelanzeigefrist nicht
              kürzer als zwei Jahre (bei gebrauchten Waren: ein Jahr unter
              Beachtung der Informations- und Formvorschriften) in den AGB
              gesetzt werden. Fristbeginn ist der gesetzliche Verjährungsbeginn.
            </p>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Aufwendungsersatz bei Nacherfüllung
            </h2>
            <p className="text-lg text-gray-700 dark:text-black">
              Der Verkäufer hat gemäß Paragraf 439 Absatz 2 BGB die zum Zwecke
              der Nacherfüllung erforderlichen Aufwendungen (z. B. Transport-,
              Wege-, Arbeits- und Materialkosten einschließlich eventueller Aus-
              und Einbaukosten) zu tragen. Diese Pflicht darf durch AGB nicht
              ausgeschlossen werden.{" "}
            </p>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Beschränkung auf Nacherfüllung
            </h2>
            <p className="text-lg text-gray-700 dark:text-black">
              Der Käufer kann bei einer mangelhaften Sache als Nacherfüllung
              nach seiner Wahl die Beseitigung des Mangels oder die Lieferung
              einer mangelfreien Sache verlangen. Erst wenn die Nacherfüllung
              nicht gelingt, nicht möglich oder nicht zumutbar ist, kann der
              Käufer – in zweiter Linie – Gewährleistungsrechte geltend machen:
              Rücktritt oder Minderung. Beschränkungen allein auf die
              Nacherfüllung sind unwirksam, wenn dem anderen Vertragsteil bei
              Fehlschlagen der Nacherfüllung das Minderungsrecht aberkannt wird.
            </p>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Mängelhaftung – Verkäufer muss Aus- und Einbaukosten übernehmen
            </h2>
            <p className="text-lg text-gray-700 dark:text-black">
              Das neue Gesetz zur Nacherfüllung gem. Paragraf 439 Abs. 3 S. 1
              des Bürgerlichen Gesetzbuches (BGB). bestimmt, dass der Verkäufer
              im Rahmen der Nacherfüllung verpflichtet ist, dem Käufer die
              notwendigen Aufwendungen für den Aus- und Einbau oder die
              Anbringung der mangelfreien Sache zu ersetzen, wenn der Käufer die
              mangelhafte Sache gemäß ihrer Art und ihrem Verwendungszweck in
              eine andere Sache eingebaut oder an eine andere Sache angebracht
              hat. Gemäß Paragraf 445a BGB kann der Verkäufer darüber hinaus
              seinen Lieferanten in Regress zu nehmen. Der Verkäufer haftet aber
              nur dann, wenn der Käufer gutgläubig war. Die Rechte des Käufers
              sind mithin ausgeschlossen, wenn der Käufer im Zeitpunkt des
              Einbaus den Mangel kannte oder infolge grober Fahrlässigkeit nicht
              kannte.
            </p>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Haftungsbeschränkungen
            </h2>
            <p className="text-lg text-gray-700 dark:text-black">
              Jeder Ausschluss oder eine Begrenzung der Haftung für Schäden aus
              der Verletzung des Lebens, des Körpers oder der Gesundheit, die
              auf einer vorsätzlichen oder fahrlässigen Pflichtverletzung des
              Verwenders oder einer vorsätzlichen oder fahrlässigen
              Pflichtverletzung eines gesetzlichen Vertreters oder
              Erfüllungsgehilfen des Verwenders beruhen, ist unwirksam.
            </p>
          </section>

          <section className="pt-8">
            <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-3">
              <FaDotCircle size={20} />
              Höhe der Verzugszinsen
            </h2>
            <p className="text-lg text-gray-700 dark:text-black">
              Ab Beginn des Verzugs schuldet der Käufer dem Verkäufer zusätzlich
              zum Kaufpreis Verzugszinsen. Ist an dem Kaufvertrag ein
              Verbraucher beteiligt, sei es als Käufer oder als Verkäufer,
              beträgt der Zinssatz 5 % über dem Basiszinssatz. Bei Kaufverträgen
              zwischen Unternehmern beträgt der Zinssatz 8 % über dem
              Basiszinssatz.
            </p>
          </section> */}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
