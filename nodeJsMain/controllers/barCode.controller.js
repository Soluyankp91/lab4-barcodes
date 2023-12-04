const express = require('express');
const multer = require('multer');
const { generateBarCode } = require('../encodeBarCode');
const { decodeImage } = require('../decodeBarCode');
const { checkIfExists } = require('../services/user.service');
const barCodeRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

barCodeRouter.post('/generateBarCode/:entityId', async (req,res, next) => {
    let { entityId } = req.params;
    let { width } = req.body;
    let entityExist = await checkIfExists(entityId);
    if(!entityExist) {
        next({ status: 400, message: `Entity does not exist with id ${entityId}`});
        return
    }
    let result = await generateBarCode(entityId, width);
    res.set('Content-Type', 'image/png');
    res.send(result);
})
barCodeRouter.post('/decodeBarCode',upload.single('file') , async (req,res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'File can not be uplaoded'});
      }
    let result = await decodeImage(req.file);

    res.send({ decoded: result})
})
barCodeRouter.use((err, req, res, next) => {
    let { message, statusCode } = err;
    res.status( statusCode || 500).send({message, stackTrace: err.stack});
})

module.exports = barCodeRouter;