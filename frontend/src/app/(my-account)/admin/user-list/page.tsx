"use client";
import {
  useDeleteUserByUserIDMutation,
  useGetUserListQuery,
  useUpdateUserByUserIDMutation,
} from "@/redux/api/userApi";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaRegTrashAlt, FaUser } from "react-icons/fa";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface FormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  mobileNumber: string;
  zipCode: string;
  address: string;
  profileImage: string;
}

interface User {
  _id: string;
  email: string;
  address: string;
  fullName: string;
  mobileNumber: string;
  profileImage: string;
  role: string;
  status: object;
  subscription: object;
  createdAt: string;
  updatedAt: string;
}

const AdminUserList = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10000);
  const [order, setOrder] = useState<string>("createdAt");
  const [sort, setSort] = useState<string>("desc");
  const [search, setSearch] = useState<string>("");
  const [field, setField] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const { data, isLoading } = useGetUserListQuery({
    page,
    limit,
    order,
    sort,
    search,
    field,
    startDate,
    endDate,
  });
  const [deleteUser] = useDeleteUserByUserIDMutation();
  // const { data: user, isLoading: getUserLoading } = useGetUserByIDQuery(userId);
  const [updateUserDetails] = useUpdateUserByUserIDMutation();

  const users = data?.payload?.data;
  // console.log(users);

  // let activeUser;
  // if (!isLoading && Array.isArray(users)) {
  //   activeUser = users.find((user: User) => user._id === userId);
  // }

  // const initialValues: FormValues = {
  //   firstName: activeUser?.fullName.split(" ")[0],
  //   lastName: activeUser?.fullName.split(" ")[1],
  //   dateOfBirth: "",
  //   mobileNumber: activeUser?.mobileNumber,
  //   zipCode: "",
  //   address: activeUser?.address,
  //   profileImage: activeUser?.profileImage,
  // };

  // const totalPages = data
  //   ? Math.ceil(data?.payload.pagination.total / limit)
  //   : 1;

  // const handleNextPage = () => {
  //   if (page < totalPages) setPage((prevPage) => prevPage + 1);
  // };

  // const handlePreviousPage = () => {
  //   if (page > 1) setPage((prevPage) => prevPage - 1);
  // };

  // const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setLimit(parseInt(e.target.value));
  //   setPage(1);
  // };

  // Delete User
  const handleDeleteUser = async (id: string) => {
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
        const res = await deleteUser(id).unwrap();
        // console.log(res);
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

  // Update User
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const updateUser = {
      firstName: values.firstName,
      lastName: values.lastName,
      dateOfBirth: values.dateOfBirth,
      mobileNumber: values.mobileNumber,
      zipCode: values.zipCode,
      address: values.address,
      profileImage: values.profileImage,
    };

    const updateDoc = {
      userID: userId,
      data: updateUser,
    };

    try {
      const res = await updateUserDetails(updateDoc).unwrap();
      if (res.response === "Success") {
        toast.success("User updated successfully!");
        const modal = document.getElementById("my_modal_5");
        if (modal) {
          (modal as HTMLDialogElement).close();
        }
      }
    } catch (error) {
      console.error(error);
    }

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        toast.success("Form submitted successfully!");
        setSubmitting(false);
        resolve();
      }, 1000);
    });
  };

  if (isLoading) {
    // return <LoadingData />;
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <HashLoader color="#5C4033" />
      </div>
    );
  }

  return (
    <div className=" flex flex-col">
      <h2 className="text-2xl font-bold text-secondary dark:text-white text-start my-5 lg:my-0 lg:mb-5">
        User List
      </h2>
      <div className=" dark:text-white mb-10 rounded shadow-md min-w-[280px] max-w-full">
        <div className="overflow-x-auto">
          <table className="table rounded overflow-hidden">
            {/* head */}
            <thead>
              <tr className="bg-[#5C4034] text-white">
                <th></th>
                <th>Name</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Address</th>
                <th></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map(
                ({
                  _id,
                  fullName,
                  email,
                  mobileNumber,
                  profileImage,
                  role,
                  address,
                }: User) => (
                  <tr
                    key={_id}
                    className="even:bg-orange-200/75 odd:bg-orange-200/25 dark:odd:bg-primary/75 dark:even:bg-primary/45"
                  >
                    <td>
                      {profileImage ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/uploads/user-profile-image/${profileImage}`}
                          width={100}
                          height={100}
                          alt="Image"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="text-2xl text-[#5c4034]">
                          <FaUser className="" />
                        </div>
                      )}
                    </td>
                    <td>{fullName}</td>
                    <td className="space-y-1">
                      <p>{email}</p>
                      <p>{mobileNumber ? mobileNumber : "+123456789"}</p>
                    </td>
                    <td>{role}</td>
                    <td>{address ? address : "123 ABC, DEF"}</td>
                    <td className="">
                      <Link
                        href={`user-list/${_id}`}
                        className="bg-secondary whitespace-nowrap active:scale-95 px-4 py-2 rounded-lg text-white"
                      >
                        View Details
                      </Link>
                    </td>
                    <td className="">
                      {role !== "Administrator" && (
                        <div>
                          <FaRegTrashAlt
                            size={17}
                            onClick={() => handleDeleteUser(_id)}
                            className="cursor-pointer text-red-600 text-2xl"
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {/* <div className="flex justify-between items-center dark:text-white">
      
        <div className="flex items-center">
          <label htmlFor="limit" className="mr-2">
            Show:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            className="border p-1 rounded bg-white text-secondary"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      
        <div className="flex items-center">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`px-3 py-1 rounded border ${
              page === 1
                ? "bg-gray-300 dark:bg-orange-100/75 cursor-not-allowed"
                : "dark:bg-orange-100/40 bg-gray-100"
            }`}
          >
            Previous
          </button>
          <span className="mx-4">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded border ${
              page === totalPages
                ? "bg-gray-300 dark:bg-orange-100/75 cursor-not-allowed"
                : "bg-gray-100 dark:bg-orange-100/40"
            }`}
          >
            Next
          </button>
        </div>
      </div> */}
      {/* Modal */}
      {/* <Modal3 initialValues={initialValues} handleSubmit={handleSubmit} /> */}
    </div>
  );
};

export default AdminUserList;
