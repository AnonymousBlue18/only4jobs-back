import cors from "cors"
import express from "express"
import morgan from "morgan"
import config from "./config"
import { onConnect } from "./database"
//ROUTERS
import betRouter from "./routes/betRoutes/betRoute"
import betSubscriptionRouter from "./routes/betRoutes/betSubscriptionRoute"
//import followerRouter from "./routes/followerRoutes/followerRoute"
import followerRouter from "./routes/followerRoutes/followerRoute"
import jobRouter from "./routes/jobRoutes/jobRoute"
import jobSubscriptionRouter from "./routes/jobRoutes/jobSubscriptionRoute"
import payRouter from "./routes/payRoutes/payRoute"
import authRouter from "./routes/userRoutes/authRoute"
import userRouter from "./routes/userRoutes/userRoute"
import withdrawRouter from "./routes/withdrawRoutes/withdrawRoute"

const app = express()

//CONFIG
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

//ruta img,banner,video
app.use("/src/assets", express.static(__dirname + "/assets"))

//ROUTES
app.use("/api", authRouter)
app.use("/api", userRouter)
app.use("/api", betRouter)
app.use("/api", betSubscriptionRouter)
app.use("/api", jobRouter)
app.use("/api", jobSubscriptionRouter)
app.use("/api", payRouter)
app.use("/api", withdrawRouter)
app.use("/api", followerRouter)

//CONNECTION
onConnect()

//LISTEN
app.listen(config.PORT, () => {
    console.log("App listen in port " + config.PORT)
})
