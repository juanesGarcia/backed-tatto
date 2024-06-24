const express = require('express');
const morgan = require('morgan');
const app = express();
const cookieParser = require('cookie-parser');

const cors = require('cors')

PORT=3004;
app.use(morgan('dev'))
//initialize middlewares
app.use(cookieParser());

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
  }));
 /* const corsOptions = {
    origin: 'https://tattopro.com',
    credentials: true,
  };
  app.use(cors(corsOptions));*/

//import routes 
const authRoutes=require('./network');



const appStart =()=>{
    try {
        app.listen(PORT,()=>{
            console.log(`listener micro-rating: ${PORT}`);
        })
        
    } catch (error) {
        console.log(`Error:${error.message}`);
    }
}

appStart()
