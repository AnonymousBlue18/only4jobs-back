import multer from "multer"
import path from "path"
import { ReadFileProps } from "src/interfaces/utils/Utils"

const useReadFile = (props: ReadFileProps) => {
    const URL_BASE = path.join(__dirname, "../assets")

    const storage = multer.diskStorage({
        destination: (_req, file, cb) => {
            console.log(file.filename.split(".").at(-1))
            cb(null, `${URL_BASE}/video`)
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`)
        },
    })

    const upload = multer({ storage: storage })

    return {
        upload,
        URL_BASE,
    }
}

export default useReadFile
