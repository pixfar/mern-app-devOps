// @ts-nocheck
"use client";
import { useMakeContactMutation } from "@/redux/api/createContactApi";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { IoMailUnreadSharp } from "react-icons/io5";
import { toast } from "react-toastify";

const Contact = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    mobileNumber: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [createContact, { isLoading }] = useMakeContactMutation();

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error message when user starts typing
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    setErrors({ ...errors, checkbox: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "Dieses Feld ist erforderlich"; // German for "This field is required"
      }
    });
    if (!isChecked) {
      newErrors.checkbox = "Bitte akzeptieren Sie die Datenschutzerklärung";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const response = await createContact(formData);
      if (response?.error) {
        toast.error(response?.error?.data?.error);
      } else {
        toast.success("Message sent successfully!");
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          mobileNumber: "",
          message: "",
        });
        setIsChecked(false);
      }
    }
  };

  return (
    <section id="support" className="px-4 md:px-8 2xl:px-0 container mx-auto">
      <div className="w-full">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="w-full rounded-lg bg-[#71584b] p-10 shadow-sm border dark:border-[#ffffff20] dark:bg-secondary md:w-3/5 lg:w-3/4 xl:p-15 mx-auto"
        >
          <h2 className="mb-14 text-3xl text-center font-semibold text-black dark:text-white">
            Dein Kontakt zum Sekretariat von MeinJustus
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-7 flex flex-col gap-7 lg:flex-row lg:justify-between lg:gap-14">
              <div className="flex flex-col w-full lg:w-1/2">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border-b border-stroke bg-transparent p-2 focus:border-water dark:border-stroke dark:focus:border-manatee lg:w-1/2"
                />
                {errors.fullName && (
                  <p className="text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div className="flex flex-col w-full lg:w-1/2">
                <input
                  type="email"
                  name="email"
                  placeholder="E-Mail"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b border-stroke bg-transparent p-2 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee lg:w-1/2"
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="mb-12 flex flex-col gap-7 lg:flex-row lg:justify-between lg:gap-14">
              <div className="flex flex-col w-full lg:w-1/2">
                <input
                  type="text"
                  name="subject"
                  placeholder="Thema"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border-b border-stroke bg-transparent p-2 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee lg:w-1/2"
                />
                {errors.subject && (
                  <p className="text-red-500">{errors.subject}</p>
                )}
              </div>

              <div className="flex flex-col w-full lg:w-1/2">
                <input
                  type="text"
                  name="mobileNumber"
                  placeholder="Telefonnummer"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full border-b border-stroke bg-transparent p-2 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee lg:w-1/2"
                />
                {errors.mobileNumber && (
                  <p className="text-red-500">{errors.mobileNumber}</p>
                )}
              </div>
            </div>

            <div className="mb-10 flex flex-col">
              <textarea
                name="message"
                placeholder="Nachricht"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full border-b border-stroke bg-transparent p-2 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee"
              ></textarea>
              {errors.message && (
                <p className="text-red-500">{errors.message}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 xl:justify-between">
              <div className="mb-4 flex md:mb-0 items-center">
                <input
                  type="checkbox"
                  id="privacy-checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="p-2 h-4 w-4 accent-primary"
                />
                <label
                  htmlFor="privacy-checkbox"
                  className="pl-5 cursor-pointer select-none dark:text-white"
                >
                  Ich stimme der&nbsp;
                  <a
                    href="https://meinjustus.de/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Datenschutzerklärung
                  </a>
                  &nbsp;zu.
                </label>
              </div>
              {errors.checkbox && (
                <p className="text-red-500">{errors.checkbox}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                aria-label="nachricht abschicken"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#5C4033] dark:bg-primary px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
              >
                {isLoading ? "Laden..." : "Nachricht abschicken"}
                <IoMailUnreadSharp size={14} className="fill-white" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
