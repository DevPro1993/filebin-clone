import { NextFunction, Request, Response } from "express";
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as utils from 'util';
import * as path from 'path';

const uploadFile = async (req: Request, res: Response) => {

    const files = req.files as Express.Multer.File[];
    const randomString = utils.promisify(crypto.randomBytes);
    const id = (await randomString(4)).toString('hex');

    Promise.all(files.map(file => saveFile(id, file)))
        .then(() => {
            res.send(id)
        }).catch((error) => {
            res.send(error)
        })

}


const getFiles = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) return res.sendStatus(400);
    const dirPath = path.join(__dirname, '..', '..', 'uploads', id);
    const readDir = utils.promisify(fs.readdir);
    const files = await readDir(dirPath)
    const query = req.query;
    if (query["fileName"]) {
        const fileName = query["fileName"] as string;
        return res.download(path.join(dirPath, fileName), fileName)
    }
    res.send(files);
}

const saveFile = async (id: string, file: Express.Multer.File): Promise<void> => {
    const mkDir = utils.promisify(fs.mkdir);
    await mkDir(path.join(__dirname, '..', '..', 'uploads', id), { recursive: true });
    await convertFile(id, file);
}

const convertFile = (id: string, file: Express.Multer.File) => {
    return new Promise<void>((resolve, reject) => {
        const src = fs.createReadStream(file.path);
        const dest = fs.createWriteStream(`uploads/${id}/${file.originalname}`);
        src.pipe(dest);
        src.on('end', () => fs.rm(file.path, () => resolve()));
        src.on('error', (error) => reject(error));
    })
}



export { uploadFile, getFiles }