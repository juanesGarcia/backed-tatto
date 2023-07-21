
const { sign } = require("jsonwebtoken");
const pool = require("../constants/db");
const {hash} = require('bcryptjs');
const { SECRET } = require("../constants");
const{v4}=require("uuid");
const { checkTokenValidity } = require("../middlewares/checkTokenValidity");

const getUsers =async(req, res) => {
    try {
     const result = await pool.query('select (id,name) from users');
      res.json(result.rows)
    } catch (error) {
        console.log(error.message)
    }
   
}
const getUser =async(req, res) => {
    const {id} = req.params;
    try {
     const result = await pool.query('select * from users where id = $1',[id]);
     if(!result.rows.length){
        return res.status(404).json({
            message:"user not found "
        })
    }
    res.json({
        success:true,
        message:"user was found"
    })
     }catch (error) { 
        console.log(error.message)
    }
   
}
const register =async(req, res) => {
    const {email,password,name} = req.body;
    try {
        const id= v4()
        const hashedPassword = await hash(password,10)
        await pool.query('insert into users(id,name,email,password) values ($1, $2,$3,$4) ',[ id,name,email,hashedPassword])
        return res.status(201).json({
            success: true,
            message: " the registracion was succefull",
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            error:error.message
        })
    }
   
}

const login= async (req,res)=>{
    let user = req.user
    console.log(user)
    payload={
        id: user.id,
        email: user.email,
        name: user.name, 
        password:user.password,
    }
    
    try {
        const token = sign(payload,SECRET)
        return res.status(200).cookie('token',token,{httpOnly:true}).json({
            success: true,
            message: "Logged in succefully ",
            info: payload,
            token: token,
        })
      
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            error:error.message
        })
    }
}

const protected =async(req, res) => {
    try {
        return res.status(200).json({
            info:'protected  info para mostrar',
        })

    } catch (error) {
        console.log(error.message)
    }
   
}

const logout =async(req, res) => {
    try {
        return res.status(200).clearCookie('token',{httpOnly:true}).json({
            success: true,
            message: "Logged out succefully ",
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            error:error.message
        })
    }
}


const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password, name } = req.body;
    const userId = req.user.id; // ID del usuario autenticado
  
    try {
      if (userId !== id) {
        return res.status(401).json({ message: 'No tienes permiso para editar este perfil.' });
      }
  
      await pool.query('UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4', [
        name,
        email,
        password,
        id
      ]);
  
      res.json({
        success: true,
        message: 'Perfil actualizado correctamente.'
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        error: error.message
      });
    }
  };
  
  const deleteUser = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // ID del usuario autenticado
  
    try {
      if (userId !== id) {
        return res.status(401).json({ message: 'No tienes permiso para eliminar este usuario.' });
      }
  
      const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({
          message: 'Usuario no encontrado.'
        });
      }
  
      res.json({
        success: true,
        message: 'Usuario encontrado y eliminado.'
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        error: error.message
      });
    }
  };
  

const verifyToken = async (req, res) => {
    const {token} = req.body;
   console.log(token);
    const isValid = await checkTokenValidity(token);
    console.log(isValid);
    if (isValid) {
      // El token es válido
      // Realizar acciones en función de la validez del token
      // Por ejemplo, redirigir al usuario a una página protegida
      res.json({
        isValid:true,
        message:"user was verify token"
    })
    } else {
      // El token no es válido
      // Realizar acciones en función de la validez del token
      // Por ejemplo, redirigir al usuario a una página de inicio de sesión
      res.json({ redirectUrl: '/login' });
    }
  };
  


module.exports ={
    getUsers,
    register,
    login,
    protected,
    logout,
    getUser,
    updateUser,
    deleteUser,
    verifyToken,

}