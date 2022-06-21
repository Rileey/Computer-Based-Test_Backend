import multer from 'multer';
import path from 'path';



const imageStorage =  multer.diskStorage({ 
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb (null, file.fieldname + '_' + Date.now()
        + path.extname(file.originalname))
    }
});

const Upload = multer({
    storage: imageStorage,
    fileFilter: (req, file, cb) => {
        // let ext = path.extname(file.originalname);
        if (!file.originalname.match(/\.(png|jpg|jpeg|JPG)$/)) {
            return cb(new Error("File type is not supported"));
        }
        cb(undefined, true);
    }
})

export default Upload;
