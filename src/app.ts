import express  from "express";
import router from "./routers/router";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({limit: '50mb'}));
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use('/api', router);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});