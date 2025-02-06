import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ContractForm = () => {
    const [title, setTitle] = useState("");
    const [parties, setParties] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErr(null);

        const contract = {
            title,
            parties: parties.split(","),
            content,
        };

        try {
            const res = await axios.post(`${backendUrl}/contracts`, contract);
            if (res.data.success) {
                toast.success(res.data.message);
                setTitle("");
                setParties("");
                setContent("");
            } else {
                setErr(res.data.error);
            }
        } catch (error) {
            setErr(error.response?.data?.message?.error || "Something went wrong");
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col gap-6 py-8">
            <h1 className="font-light text-center text-3xl">Create a new Contract.</h1>
            <form
                onSubmit={handleSubmit}
                className="max-w-3xl mx-auto bg-white py-6 px-12 rounded-2xl w-[500px] shadow-2xl"
            >
                <div className="mb-3">
                    <label className="block text-gray-600 text-lg">
                        Title<span className="ml-1 text-red-500 text-sm">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Contract Title"
                        className="border border-gray-300 p-2 w-full mb-2 focus:outline-none rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-600 text-lg">
                        Parties<span className="ml-1 text-red-500 text-sm">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Parties (comma-separated)"
                        className="border border-gray-300 p-2 w-full mb-2 focus:outline-none rounded"
                        value={parties}
                        onChange={(e) => setParties(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-600 text-lg">
                        Content<span className="ml-1 text-red-500 text-sm">*</span>
                    </label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        className="bg-white mb-2"
                    />
                </div>

                {err && (
                    <div className="w-full bg-red-100 border border-red-500 text-red-700 p-3 rounded-2xl text-sm mb-3 text-center">
                        {err}
                    </div>
                )}

                <div className="flex justify-center">
                    <button
                        className="bg-blue-500 text-white p-2 rounded font-semibold cursor-pointer hover:bg-blue-700"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Please wait..." : "Create Contract"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ContractForm;