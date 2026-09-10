import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { IoMdClose } from "react-icons/io";

interface FormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  mobileNumber: string;
  zipCode: string;
  address: string;
  profileImage: string;
}

interface Modal3Props {
  initialValues: FormValues;
  handleSubmit: (
    values: FormValues,
    helpers: { setSubmitting: (isSubmitting: boolean) => void }
  ) => void;
}

const Modal3: React.FC<Modal3Props> = ({ initialValues, handleSubmit }) => {
  return (
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box p-8">
        <div className="relative">
          <button
            className="absolute -right-7 -top-7 bg-gray-200 rounded-full p-2"
            onClick={() => {
              const modal = document.getElementById("my_modal_5");
              if (modal) {
                (modal as HTMLDialogElement).close();
              }
            }}
          >
            <IoMdClose />
          </button>

          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mx-auto space-y-5 border-2 rounded-md p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="text-base font-semibold"
                    >
                      Vorname:
                      <Field
                        type="text"
                        name="firstName"
                        placeholder="Vorname"
                        className="block w-full border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500 font-medium text-sm"
                      />
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="text-base font-semibold"
                    >
                      Nachname:
                      <Field
                        type="text"
                        name="lastName"
                        placeholder="Nachname"
                        className="block w-full border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500 font-medium text-sm"
                      />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="text-base font-semibold"
                    >
                      Geburtsdatum:
                      <Field
                        type="text"
                        placeholder="Geburtsdatum"
                        name="dateOfBirth"
                        className="block w-full border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                      />
                      <ErrorMessage
                        name="dateOfBirth"
                        component="div"
                        className="text-red-500 font-medium text-sm"
                      />
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="mobileNumber"
                      className="text-base font-semibold"
                    >
                      Mobile Number:
                      <Field
                        type="text"
                        name="mobileNumber"
                        placeholder="Mobile Number"
                        className="block w-full border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                      />
                      <ErrorMessage
                        name="mobileNumber"
                        component="div"
                        className="text-red-500 font-medium text-sm"
                      />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="zipCode"
                      className="text-base font-semibold"
                    >
                      PLZ:
                      <Field
                        type="text"
                        name="zipCode"
                        placeholder="PLZ"
                        className="block w-full border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                      />
                      <ErrorMessage
                        name="zipCode"
                        component="div"
                        className="text-red-500 font-medium text-sm"
                      />
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="text-base font-semibold"
                    >
                      Address:
                      <Field
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="block w-full  border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-red-500 font-medium text-sm"
                      />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
                  <div>
                    <label
                      htmlFor="profileImage"
                      className="text-base font-semibold"
                    >
                      Profile Image:
                      <Field
                        type="text"
                        name="profileImage"
                        placeholder="Profile Image URL"
                        className="block w-full  border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                      />
                      <ErrorMessage
                        name="profileImage"
                        component="div"
                        className="text-red-500 font-medium text-sm"
                      />
                    </label>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 w-full py-2 bg-primary text-white rounded"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </dialog>
  );
};

export default Modal3;
