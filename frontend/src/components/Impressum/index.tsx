import {
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaIdCard,
} from "react-icons/fa";

export default function CompanyDetails() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-14 md:pt-0 px-4">
      <div className="w-full max-w-2xl  shadow-xl rounded-2xl overflow-hidden dark:text-white">
        <div className="bg-secondary text-white p-6">
          <h1 className="md:text-2xl font-bold flex items-center gap-2">
            <FaBuilding className="text-3xl" />
            CtrlE Consulting & Holding GmbH
          </h1>
        </div>
        <div className="p-6 grid gap-4">
          <div className="flex items-center gap-3 ">
            <FaUser className="text-xl text-secondary flex-shrink-0" />
            <div>
              <p className="font-semibold">Geschäftsführer</p>
              <p>Mag. Philipp-Thomas Müller</p>
            </div>
          </div>
          <div className="flex items-center gap-3 ">
            <FaMapMarkerAlt className="text-xl text-secondary flex-shrink-0" />
            <div>
              <p className="font-semibold">Adresse</p>
              <p>Leitnerberg 14a, 4490 St. Florian, Austria</p>
            </div>
          </div>
          {/* <div className="flex items-center gap-3 ">
            <FaPhone className="text-xl text-secondary flex-shrink-0" />
            <div>
              <p className="font-semibold">Telefon</p>
              <p>+43 660 5810753</p>
            </div>
          </div> */}
          <div className="flex items-center gap-3 ">
            <FaEnvelope className="text-xl text-secondary flex-shrink-0" />
            <div>
              <p className="font-semibold">E-Mail</p>
              <p>sekretariat@meinjustus.de</p>
            </div>
          </div>
          <div className="flex items-center gap-3 ">
            <FaIdCard className="text-xl text-secondary flex-shrink-0" />
            <div>
              <p className="font-semibold">UID</p>
              <p>ATU79081538</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
