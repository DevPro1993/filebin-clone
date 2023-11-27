import express from "express";
import * as FileController from '../controllers/file.controller';


const fileRouter = express.Router();

fileRouter.post('/', FileController.uploadFile)
fileRouter.get('/:id', FileController.getFiles)


export default fileRouter;