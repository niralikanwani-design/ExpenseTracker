import { exportCSVApi } from "../dataAccess/transactionDAL";
import { toast } from "react-toastify";

export const exportCSVHandler = async (payload: any) => {
  try {
    const res = await exportCSVApi(payload);

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Transactions.csv";
    link.click();

    window.URL.revokeObjectURL(url);

    toast.success("CSV Exported Successfully");
  } catch (err) {
    console.error(err);
    toast.error("Failed to export CSV");
  }
};
