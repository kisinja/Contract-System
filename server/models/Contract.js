const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    title: String,
    parties: [String],
    content: String,
    signatures: [{ name: String, signature: String, signedAt: { type: Date, default: Date.now } }],
    status: { type: String, default: 'Pending' },
}, { timestamps: true });

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;