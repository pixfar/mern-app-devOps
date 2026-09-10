"use client";
import LoadingData from "@/components/Loading/UserLoading/UserLoading";
import Modal4 from "@/components/Shared/Modal/Modal4";
import {
  useDeleteSubscriptionPlanByIDMutation,
  useGetSubscriptionPlanForAdminQuery,
  useSubscriptionPlanMutation,
  useUpdateSubscriptionPlanByIDMutation,
} from "@/redux/api/subscriptionPlanApi";
import { isToken } from "@/services/auth.service";
import Link from "next/link";
import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { HiOutlineEye } from "react-icons/hi";
import { HiOutlineEyeSlash } from "react-icons/hi2";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface Benefits {
  [key: string]: string;
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  description: Benefits;
  duration_days: number;
  currency: string;
  discount: number;
  finalPrice: number;
  isPublic: boolean;
  credit: number;
}

interface FormValues {
  name: string;
  price: number;
  currency: string;
  discount: number;
  duration_days: number;
  isPublic: boolean;
  description: Benefits;
  credit: number;
}

const AdminEditSubscription = () => {
  const [subscriptionPlan] = useSubscriptionPlanMutation();
  const { data, isLoading } = useGetSubscriptionPlanForAdminQuery({});
  const [deletePlan] = useDeleteSubscriptionPlanByIDMutation();
  const [userId, setUserId] = useState<string>("");
  const [updatePlan] = useUpdateSubscriptionPlanByIDMutation();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [initialValues, setInitialValues] = useState<FormValues>({
    name: "",
    price: 0,
    currency: "",
    discount: 0,
    duration_days: 0,
    isPublic: false,
    description: {},
    credit: 0,
  });

  const plans = data?.payload;
  const token = isToken();

  let updatePlanDetails: Plan | undefined;
  if (!isLoading) {
    updatePlanDetails = plans?.find((plan: Plan) => plan._id === userId);
  }

  const handleDeletePlan = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deletePlan(id).unwrap();
        if (res.response === "Success") {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUpdatePlan = async (values: FormValues) => {
    const updateSubscription = {
      name: values.name,
      description: values.description,
      price: values.price,
      currency: values.currency,
      discount: values.discount,
      duration_days: values.duration_days,
      isPublic: values.isPublic,
      credit: +values?.credit,
    };

    const updateSubscriptionDoc = {
      id: userId,
      data: updateSubscription,
    };

    try {
      const res = await updatePlan(updateSubscriptionDoc).unwrap();
      if (res.response === "Success") {
        toast.success("Subscription Plan updated successfully");
        const modal = document.getElementById("my_modal_5");
        if (modal) {
          (modal as HTMLDialogElement).close();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePlan = async (values: FormValues) => {
    const newPlan = {
      name: values.name,
      description: values.description,
      price: +values.price,
      currency: values.currency,
      discount: values.discount,
      duration_days: values.duration_days,
      isPublic: values.isPublic,
      credit: +values?.credit,
    };

    // console.log({ newPlan });

    try {
      const res = await subscriptionPlan({
        data: newPlan,
        token,
      }).unwrap();
      if (res.response === "Success") {
        toast.success("Subscription Plan created successfully");
        const modal = document.getElementById("my_modal_5");
        if (modal) {
          (modal as HTMLDialogElement).close();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDescription = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id); // Collapse if the same row is clicked again
  };

  const openCreatePlanModal = () => {
    setMode("create");
    setInitialValues({
      name: "",
      price: 0,
      currency: "eur",
      discount: 0,
      duration_days: 0,
      isPublic: false,
      description: {},
      credit: 0,
    });
    const modal = document.getElementById("my_modal_5");
    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
  };

  if (isLoading) {
    return <LoadingData />;
  }

  return (
    <div>
      <div className="flex justify-between flex-col md:flex-row gap-4 md:items-center my-5 md:my-0">
        <h2 className="text-2xl font-bold text-secondary dark:text-white text-start md:mb-5">
          Subscribed List
        </h2>
        <button
          onClick={openCreatePlanModal} // Open the modal for creating a new plan
          className="btn btn-sm dark:text-white border-secondary dark:border-white text-secondary"
        >
          <BiPlus />
          <p>Add Subscription</p>
        </button>
      </div>

      <div className="dark:text-white mb-10 rounded shadow-md min-w-[280px] max-w-full">
        <div className="overflow-x-auto">
          <table className="table rounded">
            <thead>
              <tr className="bg-[#5C4034] text-white">
                <th>Name</th>
                <th>Price</th>
                <th>Currency</th>
                <th>Duration</th>
                <th>Discount</th>
                <th>Final Price</th>
                <th>Download Credit</th>
                <th className="text-center w-28">Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans?.map(
                ({
                  _id,
                  name,
                  price,
                  duration_days,
                  description,
                  discount,
                  finalPrice,
                  currency,
                  credit,
                }: Plan) => (
                  <React.Fragment key={_id}>
                    <tr className="even:bg-orange-200/75 odd:bg-orange-200/25 dark:odd:bg-primary/75 dark:even:bg-primary/45 whitespace-nowrap">
                      <td>{name}</td>
                      <td>
                        <p className="lg:ml-2">{price}</p>
                      </td>
                      <td>
                        <p className="lg:ml-2">{currency}</p>
                      </td>
                      <td>
                        <p className="lg:ml-3">{duration_days}</p>
                      </td>
                      <td>
                        <p className="lg:ml-4">{discount}%</p>
                      </td>
                      <td>
                        <p className="lg:ml-5">{finalPrice}</p>
                      </td>
                      <td>
                        <p className="text-center">{credit}</p>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleDescription(_id)} // Toggle description on button click
                          className="text-black dark:text-white w-28 flex justify-center text-lg text-center"
                        >
                          {expandedRow === _id ? (
                            <HiOutlineEyeSlash />
                          ) : (
                            <HiOutlineEye />
                          )}
                        </button>
                      </td>
                      <td className="text-xl flex items-center gap-3">
                        <button
                          onClick={() => {
                            setMode("edit");
                            setUserId(_id);
                            setInitialValues({
                              name,
                              price,
                              currency,
                              discount,
                              duration_days,
                              isPublic: true,
                              description: description,
                              credit,
                            });
                            const modal = document.getElementById("my_modal_5");
                            if (modal) {
                              (modal as HTMLDialogElement).showModal();
                            }
                          }}
                          title="Edit"
                          className="text-blue-600 dark:text-white"
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          onClick={() => handleDeletePlan(_id)}
                          title="Delete"
                          className="text-red-600 dark:text-white"
                        >
                          <FaRegTrashAlt />
                        </button>
                      </td>
                    </tr>

                    {expandedRow === _id && (
                      <tr className="bg-gray-200 dark:bg-primary/40">
                        <td colSpan={9}>
                          <div className="p-4 space-y-1">
                            {Object.entries(description).map(
                              ([key, value], index) => (
                                <p key={index}>
                                  <strong>{key}:</strong> {value}
                                </p>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal4
        title={
          mode === "create"
            ? "Create Subscription Plan"
            : "Edit Subscription Plan"
        }
        mode={mode} // Pass the 'mode' prop correctly
        initialValues={initialValues}
        onSubmit={mode === "create" ? handleCreatePlan : handleUpdatePlan}
      />
    </div>
  );
};

export default AdminEditSubscription;
