"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "Was macht MeinJustus?",
    answer:
      "MeinJustus ist ein KI-Tool, mit dem Du ganz einfach Deine Scripten aus dem Jura-Studium als pdf hochladen und automatisch mit den aktuellen Gesetztestexten abgleichen lassen kannst. Die Ergebnisse siehst Du direkt Online. Du kannst diese, je nach Abo, auch als fertiges pdf wieder runterladen. Zusätzlich kannst Du zu jeder einzelnen Passage Deine eigene Mitschrift ergänzen. Auf Deine Inhalte hast Du jederzeit online Zugriff.",
  },
  {
    question: "Welche Abos gibt es?",
    answer:
      "Es gibt eine 7-Tage-Gratis-Probierversion, sowie ein Semester und ein Jahresabo. Mehr dazu findest Du unter Pakete & Preise",
  },
  {
    question: "Ist MeinJustus eine Rechtsberatung?",
    answer:
      "Nein, MeinJustus ist KEINE Rechtsberatung. MeinJustus ist eie technische Unterstützung zum automatischen Abgleich Deiner Scripten mit den aktuellen Gesetzestexten.",
  },
  {
    question: "Wie kann ich bezahlen?",
    answer:
      "Wir bieten eine einfache Kreditkartenzahlung online im Registrierungsprozess an.",
  },
  {
    question: "Gibt es eine Gratis-Version zum Testen?",
    answer:
      "Ja, für 7 Tage kannst Du MeinJustus gratis ausprobieren, jedoch ohne der Download-Funktion. Deine Daten bleiben Dir aber natürlich erhalten, solltest Du danach auf ein bezahlpflichtiges Paket wechseln.",
  },
];

const FAQItem: React.FC<{ item: FAQItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border-b border-gray-200 py-4"
    >
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium">{item.question}</span>
        {isOpen ? (
          <BiChevronUp className="h-5 w-5 text-gray-500 dark:text-white" />
        ) : (
          <BiChevronDown className="h-5 w-5 text-gray-500 dark:text-white" />
        )}
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden mt-2"
      >
        <p className="text-gray-600 dark:text-gray-200">{item.answer}</p>
      </motion.div>
    </motion.div>
  );
};

const FAQPage: React.FC = () => {
  return (
    <div className="min-h-screen ">
      <div>
        {/* Drop-in Animation for H1 */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pt-28 flex items-center justify-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center text-secondary dark:text-white ">
            Frequently Asked Questions?
          </h1>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-orange-100 p-3 shadow-md rounded-lg overflow-hidden dark:bg-secondary dark:text-white">
          {faqs.map((faq, index) => (
            <FAQItem key={index} item={faq} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FAQPage;
