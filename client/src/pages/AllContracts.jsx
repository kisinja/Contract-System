import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AllContracts = () => {

    const [contracts, setContracts] = useState(null);
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const getContracts = async () => {
        try {
            const res = await axios.get(`${backendUrl}/contracts`);
            if (res.status === 200) {
                setContracts(res.data.contracts);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getContracts();
    }, []);

    if (loading) return <p>Loading contracts...</p>;
    if (!contracts) return <div className="text-gray-600">No contracts found.</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">All Contracts</h1>
            <ul className="list-disc pl-6">
                {contracts && contracts.map((contract) => (
                    <li key={contract._id} className="mb-2">
                        <Link to={`/contracts/${contract._id}`} className="text-blue-600 hover:underline">
                            {contract.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllContracts;
