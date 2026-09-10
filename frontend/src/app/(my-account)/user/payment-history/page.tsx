"use client";

import { useGetUserQuery } from "@/redux/api/userApi";
import { isToken } from "@/services/auth.service";
import { useState } from "react";
import { FaDownload, FaEye } from "react-icons/fa";
import { HashLoader } from "react-spinners";

function PaymentHistory() {
  const token = isToken();
  const { data: userData, isLoading: userDataLoading } = useGetUserQuery(token);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const paymentInfo = userData?.payload;
  console.log(paymentInfo);

  const downloadPDF = async (paymentId: any) => {
    try {
      setDownloadLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscription/invoice/${paymentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloadLoading(false);
    } catch (error) {
      setDownloadLoading(false);
      console.error("Error downloading PDF:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (userDataLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <HashLoader color="#5C4033" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table bg-[#5C4034] text-white rounded  min-w-[280px] max-w-full">
        <thead>
          <tr>
            <th className="text-nowrap">Betrag</th>
            <th className="text-nowrap">Steuer</th>
            <th className="text-nowrap">Währung</th>
            {/* <th className="text-nowrap">Gesamtbetrag</th> */}
            <th className="text-nowrap">Zahlungsart</th>
            <th className="text-nowrap">Status</th>
            <th className="text-nowrap">Datum</th>
            <th className="text-nowrap">Zeit</th>
            <th className="text-nowrap text-center">Download</th>
          </tr>
        </thead>
        <tbody>
          {paymentInfo?.length ? (
            paymentInfo?.map((allPayment: any) => {
              const data = allPayment?.subscription?.currentPlan?.payment;

              const formattedDate = data
                ? new Date(data?.createdAt)
                    .toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(",", "")
                    .toUpperCase()
                : "N/A";

              const formattedTime = data
                ? new Date(data?.createdAt)
                    .toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "UTC",
                    })
                    .replace(",", "")
                    .toUpperCase()
                : "N/A";

              return allPayment?.subscription ? (
                <tr
                  key={data?._id}
                  className="capitalize even:bg-orange-200/75 odd:bg-orange-200/25 dark:odd:bg-primary/75 dark:even:bg-primary/45 border-none whitespace-nowrap"
                >
                  <td className="text-nowrap">€{data?.finalAmount / 100}</td>
                  <td className="text-nowrap">
                    €{(data?.taxAmount / 100).toFixed(2)}
                  </td>
                  <td className="text-nowrap uppercase">{data?.currency}</td>
                  <td className="text-nowrap">
                    {data?.payment_method_types[0] === "card" && "Kreditkarte"}
                  </td>
                  <td>
                    <span
                      className={`text-nowrap ${
                        data?.status == "succeeded"
                          ? "bg-green-200 font-bold px-2 rounded-full py-1 text-green-800"
                          : ""
                      }`}
                    >
                      {data?.status == "succeeded" && "Erfolgreich"}
                    </span>
                  </td>
                  <td className="text-nowrap">{formattedDate}</td>
                  <td className="text-nowrap">{formattedTime}</td>
                  <td className="text-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      {/* <p
                   title="View Info"
                   className="cursor-pointer border p-1 rounded"
                 >
                   <FaEye />
                 </p> */}

                      <button
                        disabled={downloadLoading}
                        onClick={() => downloadPDF(data?.id)}
                        className="border p-1 rounded"
                      >
                        <FaDownload />
                      </button>
                      {/* <p title="Download PDF" className="cursor-pointer">
                   <FaDownload />
                 </p> */}
                    </div>
                  </td>
                </tr>
              ) : (
                <tr className="capitalize even:bg-orange-200/75 odd:bg-orange-200/25 dark:odd:bg-primary/75 dark:even:bg-primary/45 border-none whitespace-nowrap">
                  <td colSpan={8} className="text-center">
                    Keine Daten
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="bg-red-500">
                Not
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentHistory;
