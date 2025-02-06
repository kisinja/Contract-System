import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const DownloadPDF = () => {

    const contractId = useParams();
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:7788/api/contracts/${contractId.id}/pdf`, {
                responseType: "blob",
            });
            console.log(response.data);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "contract.pdf");
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            toast.error("Error downloading PDF!");
            console.error("Error downloading PDF:", error);
        } finally {
            setLoading(false);
        }
    };

    return <button className="bg-green-500 text-white px-4 py-2 hover:bg-green-700 cursor-pointer" onClick={handleDownload} disabled={loading}>
        {
            loading ? 'Downloading...' : "Download Contract"
        }
    </button>;
};

export default DownloadPDF;