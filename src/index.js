const express = require('express');
const morgan = require('morgan');
const app = express();
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors')
const {CLIENT_URL}= require('./constants')



require('./middlewares/passport-middleware')
PORT=4000;
app.use(morgan('dev'))
//initialize middlewares
app.use(cookieParser());
app.use(passport.initialize())
app.use(express.json());
app.use(cors({
    origin:'https://tattopro.com' ,
    credentials: true
  }));
 /* const corsOptions = {
    origin: ,
    credentials: true,
  };
  app.use(cors(corsOptions));*/

//import routes 
const authRoutes=require('./routes/users.routes');


app.use(authRoutes);

const appStart =()=>{
    try {
        app.listen(PORT,()=>{
            console.log(`listener: ${PORT}`);
        })
        
    } catch (error) {
        console.log(`Error:${error.message}`);
    }
}

appStart()