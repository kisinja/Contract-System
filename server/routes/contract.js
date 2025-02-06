const express = require('express');
const router = express.Router();

const {
    createContract,
    getContracts,
    getContractById,
    signContract,
    generatePdf
} = require('../controllers/contract');

router.post('/', createContract);
router.get('/', getContracts);
router.get('/:id', getContractById);
router.post('/sign', signContract);
router.get('/:contractId/pdf', generatePdf);

module.exports = router;