const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const router = express.Router();
const path = require("path");

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});


// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname,"../frontend-design/build")));

//   app.get("*",(req,res)=> {
//     res.sendFile(path.resolve(__dirname,"../frontend-design/build","index.html"))
//   })
// } else {
//   app.get("/",(req,res)=> {
//     res.send("api is up and running")
//   })
// }

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});




// const express = require ("express")
// const app = express ()
// const cors = require('cors')
// const helmet = require("helmet");
// var morgan = require('morgan')
// const mongoose = require ("mongoose")
// const userRoute = require("./routes/user")
// const authRoute = require("./routes/auth")
// const postRoute = require ("./routes/post"); 
// const multer = require("multer");
// const path = require("path")

// require('dotenv').config()

// mongoose.connect(process.env.MONGO_URL,()=>{
//     console.log("database connected");
// });

// app.use("/images",express.static(path.join(__dirname,"public/images")));






// //middlewears
// app.use(express())
// app.use(helmet())
// app.use(morgan('combined'))
// app.use(express.urlencoded({extended: true}));
// app.use(express.json()) 

// app.use(cors())

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "public/images");
//     },
//     filename: (req, file, cb) => {
//       cb(null,file.originalname);
//     },
//   });
  
//   const upload = multer({ storage: storage });
//   app.post("/api/upload", upload.single("file"), (req, res) => {
//     try {
//       return res.status(200).json("File uploded successfully");
//     } catch (error) {
//       console.error(error);
//     }
//   });


// app.use("/api/user",userRoute)

// app.use("/api/auth",authRoute)

// app.use("/api/post",postRoute)

// app.listen(8800,()=> {
//     console.log("server is up and running at port number 8080");
// })