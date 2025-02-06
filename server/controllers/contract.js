const fs = require("fs");
const path = require("path");
const hbs = require("handlebars");
const PuppeteerHTMLPDF = require("puppeteer-html-pdf");
const Contract = require("../models/Contract");

const htmlPDF = new PuppeteerHTMLPDF();

const generatePdf = async (req, res) => {
    const { contractId } = req.params;
    console.log("Generating PDF for contract ID:", contractId);

    try {
        // Ensure Puppeteer is initialized
        await htmlPDF.initializeBrowser();

        // Fetch contract from MongoDB
        const contract = await Contract.findById(contractId);
        if (!contract) {
            throw new Error("Contract not found");
        }

        // Prepare data for Handlebars template
        const pdfData = {
            title: contract.title,
            parties: contract.parties.join(", "),
            content: contract.content,
            signatures: contract.signatures.map(s => ({
                name: s.name,
                signature: s.signature, // This should be a valid image URL or Base64 string
                signedAt: s.signedAt.toLocaleDateString()
            }))
        };

        // Load and compile Handlebars template
        const htmlPath = path.join(__dirname, "contract_template.html");
        const html = fs.readFileSync(htmlPath, "utf8");
        const template = hbs.compile(html);
        const content = template(pdfData);

        // Ensure the "contracts" directory exists
        const contractsDir = path.join(__dirname, "contracts");
        if (!fs.existsSync(contractsDir)) {
            fs.mkdirSync(contractsDir, { recursive: true });
        }

        // Set PDF generation options
        const options = {
            format: "A4",
            path: path.join(contractsDir, `${contract.title}.pdf`),
        };
        htmlPDF.setOptions(options);

        // Generate PDF using Puppeteer
        await htmlPDF.create(content);
        const filePath = options.path;

        console.log("PDF successfully generated:", filePath);
        res.status(200).json({ message: "PDF generated successfully", filePath });
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await htmlPDF.closeBrowser();
    }
};

const createContract = async (req, res) => {
    try {
        const contract = new Contract(req.body);
        await contract.save();
        res.status(201).json({ message: "Contract created successfully!", success: true, contract });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
};

const getContracts = async (req, res) => {
    try {
        const contracts = await Contract.find({});
        res.status(200).json({ success: true, contracts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        console.log(error.message);
    }
};

const getContractById = async (req, res) => {
    const contractId = req.params.id;
    try {
        const contract = await Contract.findById(contractId);
        if (!contract) return res.status(404).json({ message: "Contract not found!", success: false });

        res.status(200).json({ success: true, contract });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
};

const signContract = async (req, res) => {
    const { contractId, name, signature } = req.body;

    try {
        const contract = await Contract.findById(contractId);
        if (!contract) return res.status(404).json({ message: "Contract not found" });

        // Save signature
        contract.signatures.push({ name, signature });
        contract.status = "Signed"; // Mark contract as signed
        await contract.save();

        res.json({ message: "Signature saved successfully", contract });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createContract,
    getContracts,
    getContractById,
    signContract,
    generatePdf
};