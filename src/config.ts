import dotenv from "dotenv"

dotenv.config()
export default {
    KEY: String(process.env.ONLY4JOBS_KEY),
    USER: String(process.env.ONLY4JOBS_USER),
    DATABASE: String(process.env.ONLY4JOBS_DATABASE),
    PASSWORD: String(process.env.ONLY4JOBS_PASSWORD),
    DOMAIN: String(process.env.ONLY4JOBS_DOMAIN),
    HOST: String(process.env.ONLY4JOBS_HOST),
    DB_PORT: Number(process.env.ONLY4JOBS_DB_PORT),
    PORT: Number(process.env.PORT),
    HASH: Number(process.env.ONLY4JOBS_HASH_SALTS),
}
 