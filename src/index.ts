import express from "express";
import router from "./routes/post.js";

const app = express();

app.use(express.json());

app.use(router)

app.listen(3333, () => {
  console.log("App's listening on port 3333")
})
