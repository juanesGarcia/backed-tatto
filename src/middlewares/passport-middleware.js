const passport = require('passport');
const {Strategy} = require('passport-jwt');
const {SECRET} = require("../constants")

const db= require("../constants/db")

// Configura el extractor de cookies
const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};

// Configura la estrategia de autenticación JWT
const Options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: SECRET,
};

passport.use(
  new Strategy(Options, async ({id},done)=> {
    try {
      const {rows} = await db.query("select id,email  from users where id = $1",[id])
      if(!rows.length){
        throw Error("401 not authorized ")
      }
      let user ={id: rows[0].id , email:rows[0].email}
      return await done(null,user)
    } catch (error) {
    console.log(error.message)
      return done(null,false);
    }
  })
);

module.exports = passport;
