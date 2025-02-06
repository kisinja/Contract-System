import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignaturePad = ({ contractId }) => {
    const sigCanvas = useRef(null);
    const [signature, setSignature] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    // Function to save the signature
    const saveSignature = async () => {

        setLoading(true);

        if (!sigCanvas.current.isEmpty()) {
            const sigData = sigCanvas.current.toDataURL(); // Convert to base64
            setSignature(sigData);

            // Send signature to backend
            try {
                const response = await axios.post(`${backendUrl}/contracts/sign`, {
                    contractId,
                    name,
                    signature: sigData
                });
                if (response.status === 200) {
                    console.log(response.data);
                    navigate(`/contracts/${contractId}/download-pdf`);
                    toast.success("Document signed Successfully!");
                    setSignature('');
                    setName('');
                }
            } catch (error) {
                console.error("Error saving signature:", error);
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please provide a signature.");
        }
    };

    return (
        <div className="p-4 shadow-xl rounded-2xl w-full mx-auto mt-6 bg-white">
            <h2 className="text-xl mb-2">Sign Contract</h2>
            <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ width: 400, height: 150, className: "border border-gray-300 rounded w-full" }}
            />
            <div className="w-full mt-3">
                <input type="text" className="w-full p-2 border border-gray-300 rounded focus:outline-none" placeholder="Enter your name" id="" onChange={(e) => setName(e.target.value)} value={name} />
            </div>
            <div className="flex justify-between mt-2">
                <button className="bg-gray-500 text-white px-4 py-2" onClick={() => sigCanvas.current.clear()}>
                    Clear
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 cursor-pointer" onClick={saveSignature}>
                    Sign Contract
                </button>
            </div>
            {signature && <img src={signature} alt="Signature Preview" className="mt-2 border" />}
        </div>
    );
};

export default SignaturePad;