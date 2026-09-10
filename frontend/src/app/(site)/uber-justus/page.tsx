/* eslint-disable @next/next/no-img-element */

const AboutUsPage = () => {
  return (
    <>
      <div className="container lg:pt-40 py-20 mx-auto flex flex-col justify-center items-center px-4">
        <div className="space-y-10">
          <div className="bg-orange-200/50 dark:bg-gradient-to-tl from-secondary/50 to-primary/50 p-5 rounded hover:scale-105 duration-500">
            <h2 className="text-3xl mb-2 text-secondary font-bold">
              Was ist MeinJustus?
            </h2>
            <p className="text-xl text-justify">
              Justus ist Dein KI-Assistent fürs Jura-Studium. Du kannst hier
              ganz einfach <b>Deine Scripten</b> aus Deinen Vorlesungen und
              Kursen als pdf hochladen und die{" "}
              <b>KI findet dazu automatisch alle passenden Gesetzestexte.</b>
            </p>
          </div>
          <div className="bg-orange-200/50 dark:bg-gradient-to-tl from-secondary/50 to-primary/50 p-5 rounded hover:scale-105 duration-500">
            <h2 className="text-3xl mb-2 text-secondary font-bold">
              Und dann?
            </h2>
            <p className="text-xl text-justify">
              ….kannst Du die gesammelten Gesetzestexte{" "}
              <b>
                mit Deiner Mitschrift ergänzen und als fertiges pdf wieder
                runterladen.
              </b>{" "}
              Je nach Abopaket steht Dir eine unterschiedliche Anzahl an
              Downloads Deiner pdfs zur Verfügung. Du kannst aber natürlich
              jederzeit zusätzliche Downloads erwerben.
            </p>
          </div>
          <div className="bg-orange-200/50 dark:bg-gradient-to-tl from-secondary/50 to-primary/50 p-5 rounded hover:scale-105 duration-500">
            <h2 className="text-3xl mb-2 text-secondary font-bold">
              Immer aktuell?
            </h2>
            <p className="text-xl text-justify">
              Ja, immer aktuell. Justus greift dabei auf den{" "}
              <strong>tagesaktuellen Stand der Deutschen Gesetze zu.</strong> Du
              brauchst Dir keine Sorgen um Aktualität machen.
            </p>
          </div>
          <div className="bg-orange-200/50 dark:bg-gradient-to-tl from-secondary/50 to-primary/50 p-5 rounded hover:scale-105 duration-500">
            <h2 className="text-3xl mb-2 text-secondary font-bold">
              Fürs ganze Studium geeignet
            </h2>
            <p className="text-xl text-justify">
              Du kannst gebunden ans Abo jederzeit nutzen, gern auch über Dein{" "}
              <strong>ganzes Studium.</strong> So sammelst Du praktisch alle
              Mitschriften und Gesetzessammlungen an einem Ort und kannst Sie
              jederzeit downloaden.
            </p>
          </div>
          <div className="bg-orange-200/50 dark:bg-gradient-to-tl from-secondary/50 to-primary/50 p-5 rounded hover:scale-105 duration-500">
            <h2 className="text-3xl mb-2 text-secondary font-bold">
              Ist MeinJustus eine Rechtsplattform?
            </h2>
            <p className="text-xl text-justify">
              MeinJustus ist ausdrücklich keine Rechtsberatung oder
              Rechtsplattform. Es handelt sich bei MeinJustus um eine
              Cloud-Software, die mittels KI-Technologie bestehende
              Informationen zusammenfügt.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;
