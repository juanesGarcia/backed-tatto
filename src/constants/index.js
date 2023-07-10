const { config} = require("dotenv");
config()

module.exports={
    SECRET: process.env.SECRET,
    CLIENT_URL:process.env.CLIENT_URL,
}
