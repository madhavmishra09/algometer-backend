const express=require("express");
const rateLimit=require("express-rate-limit");
const analyzeRoute=require("./routes/analyze");

const app=express();

app.use(express.json({limit:"50kb"}));
app.use(
    rateLimit({
        windowMs: 60 * 1000,
        max: 30
    })
);

app.use("/analyze",analyzeRoute);

app.listen(3000, ()=>{
    console.log("Algometer running on port 3000");
})