import express  from "express";
import router from "./routers/router";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', router);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});