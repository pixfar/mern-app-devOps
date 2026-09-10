// "use client";
// import { useSubscriptionPlanMutation } from "@/redux/api/subscriptionPlanApi";
// import { Formik, Field, ErrorMessage, Form } from "formik";
// import { toast } from "react-toastify";
// import * as Yup from "yup";

// interface FormValues {
//   name: string;
//   benefits: string;
//   limitations: string;
//   price: number;
//   currency: string;
//   discount: number;
//   duration_days: number;
//   isPublic: boolean;
// }

// const validationSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   benefits: Yup.string().required("Benefits is required"),
//   limitations: Yup.string().required("Limitations is required"),
//   price: Yup.string().required("Price is required"),
//   currency: Yup.string().required("Currency is required"),
//   discount: Yup.string().required("Discount is required"),
//   duration_days: Yup.string().required("Duration is required"),
//   isPublic: Yup.string().required("IsPublic is required"),
// });

// const AdminSubscriptionPlan = () => {
//   const initialValues: FormValues = {
//     name: "",
//     benefits: "",
//     limitations: "",
//     price: 0,
//     currency: "",
//     discount: 0,
//     duration_days: 0,
//     isPublic: true,
//   };
//   const [addSubscriptionPlan] = useSubscriptionPlanMutation();

//   const handleSubmit = async (
//     values: FormValues,
//     { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
//   ) => {
//     const subscription = {
//       name: values.name,
//       description: {
//         benefits: values.benefits,
//         limitations: values.limitations,
//       },
//       price: values.price,
//       currency: values.currency,
//       discount: values.discount,
//       duration_days: values.duration_days,
//       isPublic: values.isPublic,
//     };

//     try {
//       const res = await addSubscriptionPlan(subscription).unwrap();
//       if (res.response === "Success") {
//         toast.success(`${values.name} plan created successfully`);
//       }
//     } catch (error) {
//       console.log(error);
//     }

//     return new Promise<void>((resolve) => {
//       setTimeout(() => {
//         console.log("Form submitted successfully!");
//         setSubmitting(false);
//         resolve();
//       }, 1000);
//     });
//   };

//   return (
//     <div>
//       <h1 className="text-2xl text-secondary text-center mb-10 font-bold">
//         Add Subscription Plan
//       </h1>
//       <div>
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form className="w-3/4 mx-auto space-y-5 border-2 rounded-md p-5">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="name" className="text-base font-semibold">
//                     Name:
//                     <Field
//                       type="text"
//                       name="name"
//                       placeholder="Plan Name"
//                       className="block w-full text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
//                     />
//                     <ErrorMessage
//                       name="name"
//                       component="div"
//                       className="text-red-500 font-medium text-sm"
//                     />
//                   </label>
//                 </div>
//                 <div>
//                   <label htmlFor="benefits" className="text-base font-semibold">
//                     Benefits:
//                     <Field
//                       type="text"
//                       name="benefits"
//                       placeholder="Benefits"
//                       className="block w-full text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
//                     />
//                     <ErrorMessage
//                       name="benefits"
//                       component="div"
//                       className="text-red-500 font-medium text-sm"
//                     />
//                   </label>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div>
//                   <label
//                     htmlFor="limitations"
//                     className="text-base font-semibold"
//                   >
//                     Limitations:
//                     <Field
//                       type="text"
//                       placeholder="Limitations"
//                       name="limitations"
//                       className="block w-full text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
//                     />
//                     <ErrorMessage
//                       name="limitations"
//                       component="div"
//                       className="text-red-500 font-medium text-sm"
//                     />
//                   </label>
//                 </div>
//                 <div>
//                   <label htmlFor="price" className="text-base font-semibold">
//                     Price:
//                     <Field
//                       type="text"
//                       name="price"
//                       placeholder="Price"
//                       className="block w-full text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
//                     />
//                     <ErrorMessage
//                       name="price"
//                       component="div"
//                       className="text-red-500 font-medium text-sm"
//                     />
//                   </label>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="currency" className="text-base font-semibold">
//                     Currency:
//                     <Field
//                       type="text"
//                       name="currency"
//                       placeholder="Currency"
//                       className="block w-full text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
//                     />
//                     <ErrorMessage
//                       name="currency"
//                       component="div"
//                       className="text-red-500 font-medium text-sm"
//                     />
//                   </label>
//                 </div>
//                 <div>
//                   <label htmlFor="discount" className="text-base font-semibold">
//                     Discount:
//                     <Field
//                       type="text"
//                       name="discount"
//                       placeholder="Discount"
//                       className="block w-full text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
//                     />
//                     <ErrorMessage
//                       name="discount"
//                       component="div"
//                       className="text-red-500 font-medium text-sm"
//                     />
//                   </label>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div>
//                   <label
//                     htmlFor="duration_days"
//                     className="text-base font-semibold"
//                   >
//                     Duration Days:
//                     <Field
//                       type="text"
//                       name="duration_days"
//                       className="block w-full text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
//                     />
//                     <ErrorMessage
//                       name="duration_days"
//                       component="div"
//                       className="text-red-500 font-medium text-sm"
//                     />
//                   </label>
//                 </div>
//                 <div>
//                   <label htmlFor="isPublic" className="text-base font-semibold">
//                     Is Public:
//                     <Field
//                       type="text"
//                       name="isPublic"
//                       className="block w-full text-sm font-normal bg-white py-2 px-5 rounded focus:outline-none"
//                     />
//                     <ErrorMessage
//                       name="isPublic"
//                       component="div"
//                       className="text-red-500 font-medium text-sm"
//                     />
//                   </label>
//                 </div>
//               </div>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-4 py-2 bg-primary text-white rounded"
//               >
//                 Submit
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default AdminSubscriptionPlan;

import React from "react";

const page = () => {
  return <div></div>;
};

export default page;
