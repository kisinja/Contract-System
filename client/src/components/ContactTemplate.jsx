import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SignaturePad from "./SignaturePad";

const ContractTemplate = () => {
    const { id } = useParams();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchContract = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/contracts/${id}`);
                if (data.success) {
                    setContract(data.contract);
                    console.log(data);
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContract();
    }, [id]);

    if (loading) return <p>Loading contract...</p>;
    if (!contract) return <p>Contract not found.</p>;

    return (
        <section>
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-300">
                <div className="bg-blue-600 text-white p-4 rounded-t-lg text-center font-bold text-xl">
                    {contract.title}
                </div>
                <div className="p-4 text-gray-800">
                    <h2 className="text-lg font-bold">1. PARTIES</h2>
                    <p>
                        This contract is entered into by: <br />
                        <span className="text-blue-600 font-bold">{contract.parties.join(" and ")}</span>
                    </p>
                    <h2 className="text-lg font-bold mt-4">2. CONTENT</h2>
                    <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: contract.content }}></div>
                </div>
                <SignaturePad contractId={contract._id} />
            </div>
        </section>
    );
};

export default ContractTemplate;