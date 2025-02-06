import { BrowserRouter, Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContractForm from "./components/ContractForm";
import ContractTemplate from "./components/ContactTemplate";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AllContracts from "./pages/AllContracts"; // New page
import DownloadPDF from "./components/DownloadPdf";


const App = () => {


  return (
    <main>
      <div className="px-12">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-contract" element={<ContractForm />} />
            <Route path="/all-contracts" element={<AllContracts />} />
            <Route path="/contracts/:id" element={<ContractTemplate />} />
            <Route path="/contracts/:id/download-pdf" element={<DownloadPDF />} />
          </Routes>
        </BrowserRouter>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </main>
  );
};

export default App;