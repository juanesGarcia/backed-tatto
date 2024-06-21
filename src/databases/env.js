const { config} = require("dotenv");
config()




module.exports={
    SECRET: process.env.SECRET,
    CLIENT_URL: process.env.CLIENT_URL,
    AWS_PUBLIC_KEY :process.env.AWS_PUBLIC_KEY,
    AWS_SECRET_KEY : process.env.AWS_SECRET_KEY,
    AWS_BUCKET_NAME : process.env.AWS_BUCKET_NAME,
    AWS_BUCKET_REGION:  process.env.AWS_BUCKET_REGION,
}


