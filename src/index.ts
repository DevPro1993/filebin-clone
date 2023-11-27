import express from 'express';
import multer from 'multer';
import fileRouter from './routes/file.routes';

const upload = multer({ dest: 'temp/' })

const app = express();


app.use('/file', upload.array('file') ,fileRouter)


app.listen(3000, () => {
    console.log('Server listening on 3000')
})

