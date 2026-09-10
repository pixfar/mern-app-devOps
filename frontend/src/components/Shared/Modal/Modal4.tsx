import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

interface FormValues {
  name: string;
  price: number;
  currency: string;
  discount: number;
  duration_days: number;
  isPublic: boolean;
  description: {
    [key: string]: string;
  };
  credit: number;
}

interface Modal4Props {
  title: string;
  initialValues: FormValues;
  onSubmit: (values: FormValues) => Promise<void>;
  mode: "create" | "edit";
}

const Modal4: React.FC<Modal4Props> = ({
  title,
  initialValues,
  onSubmit,
  mode,
}) => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [editingKeys, setEditingKeys] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDescriptionKeyChange = (oldKey: string, newKey: string) => {
    setEditingKeys((prev) => ({
      ...prev,
      [oldKey]: newKey, // Temporarily store the new key
    }));
  };

  const handleDescriptionValueChange = (key: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [key]: value, // Update value for the same key
      },
    }));
  };

  const saveKeyChange = (oldKey: string, newKey: string) => {
    const updatedDescription = { ...formValues.description };

    if (oldKey !== newKey) {
      delete updatedDescription[oldKey];
      updatedDescription[newKey] = formValues.description[oldKey];
    }

    setFormValues((prev) => ({
      ...prev,
      description: updatedDescription,
    }));

    setEditingKeys((prev) => {
      const { [oldKey]: removed, ...rest } = prev;
      return rest;
    });
  };

  const addDescriptionField = () => {
    setFormValues((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        "": "", // Blank key and value
      },
    }));
  };

  const deleteDescriptionField = (key: string) => {
    setFormValues((prev) => {
      const updatedDescription = { ...prev.description };
      delete updatedDescription[key]; // Delete the selected key
      return {
        ...prev,
        description: updatedDescription,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formValues); // Call onSubmit prop
  };

  return (
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box p-8 bg-primary">
        <div className="relative">
          <form method="dialog" className="absolute -right-7 -top-0">
            <button
              type="button"
              className="bg-gray-200 hover:bg-red-200 duration-200 rounded-full p-2"
              onClick={() => {
                const modal = document.getElementById(
                  "my_modal_5"
                ) as HTMLDialogElement;
                modal?.close();
              }}
            >
              <IoMdClose />
            </button>
          </form>
          <form
            onSubmit={handleSubmit}
            className="mx-auto space-y-5 rounded-md"
          >
            <h3 className="text-xl text-center font-semibold">{title}</h3>

            <div className="flex flex-col gap-4">
              {/* Name Field */}
              <div className="flex flex-col">
                <label htmlFor="name" className="text-base font-semibold">
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    className="block w-full border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                  />
                </label>
              </div>

              {/* Description Fields (both key and value) */}
              <div className="flex flex-col">
                <label className="text-base font-semibold">Description:</label>
                {Object.entries(formValues.description)?.map(([key, value]) => (
                  <div key={key} className="flex gap-4 items-center mb-2">
                    {/* Editable Key */}
                    <input
                      type="text"
                      value={editingKeys[key] || key}
                      onChange={(e) =>
                        handleDescriptionKeyChange(key, e.target.value)
                      }
                      onBlur={() => saveKeyChange(key, editingKeys[key] || key)}
                      className="block w-1/2 border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                      placeholder="Enter Key"
                    />
                    {/* Editable Value */}
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        handleDescriptionValueChange(key, e.target.value)
                      }
                      className="block w-1/2 border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                      placeholder="Enter Value"
                    />
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => deleteDescriptionField(key)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaRegTrashAlt className="cursor-pointer text-red-500" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDescriptionField}
                  className="mt-2 text-black/50 underline"
                >
                  Add More Feature
                </button>
              </div>

              {/* Price Field */}
              <div className="flex flex-col">
                <label htmlFor="price" className="text-base font-semibold">
                  Price:
                  <input
                    type="number"
                    name="price"
                    value={formValues.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="block w-full border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                  />
                </label>
              </div>

              {/* Currency Field */}
              <div className="flex flex-col">
                <label htmlFor="currency" className="text-base font-semibold">
                  Currency:
                  <select
                    className="block w-full border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                    value={formValues.currency}
                    onChange={handleChange}
                    name="currency"
                    id="currency"
                  >
                    <option value="eur">EUR</option>
                    <option value="usd">USD</option>
                    <option value="jpy">JPY</option>
                    <option value="gbp">GBP</option>
                    <option value="aud">AUD</option>
                  </select>
                </label>
              </div>

              {/* Discount Field */}
              <div className="flex flex-col">
                <label htmlFor="discount" className="text-base font-semibold">
                  Discount:
                  <input
                    type="number"
                    name="discount"
                    value={formValues.discount}
                    onChange={handleChange}
                    placeholder="Discount"
                    className="block w-full border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                  />
                </label>
              </div>

              {/* Credit Field */}
              <div className="flex flex-col">
                <label htmlFor="credit" className="text-base font-semibold">
                  Download Credit:
                  <input
                    type="number"
                    name="credit"
                    value={formValues.credit}
                    onChange={handleChange}
                    placeholder="Credit"
                    className="block w-full border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                  />
                </label>
              </div>

              {/* Duration Days Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="duration_days"
                  className="text-base font-semibold"
                >
                  Duration Days:
                  <input
                    type="number"
                    name="duration_days"
                    value={formValues.duration_days}
                    onChange={handleChange}
                    className="block w-full border text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
                  />
                </label>
              </div>

              {/* Is Public Field */}
              <div className="flex flex-col">
                <label htmlFor="isPublic" className="text-base font-semibold">
                  Is Public:
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formValues.isPublic}
                    onChange={handleChange}
                    className="mt-2 border ml-2"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="px-4 py-2   font-bold rounded bg-secondary text-white active:scale-90"
              >
                {mode === "create" ? "Create Plan" : "Update Plan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default Modal4;
