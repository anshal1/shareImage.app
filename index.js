const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;
const Connect = require("./Schema/Connection");
require("dotenv").config();
app.use(express.json());
app.use(cors({
    origin: "*",
}));
app.use("/", require("./Routes/Auth.js"));
app.use("/", require("./Routes/Upload.js"));
Connect();

// app.listen(PORT, () => {
//     console.log(`App is running on Port ${PORT}`);
// });
module.export = app;


