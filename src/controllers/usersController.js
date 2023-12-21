
const { sign } = require("jsonwebtoken");
const pool = require("../constants/db");
const {hash} = require('bcryptjs');
const { SECRET } = require("../constants");
const{v4}=require("uuid");
const { checkTokenValidity } = require("../middlewares/checkTokenValidity");
const { uploadFiles,deleteFileByName} =require("../firabase")
const fs = require('fs');
const path = require('path');

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
    console.log(id)
    try {
     const result = await pool.query('select name,email from users where id = $1',[id]);
     if(!result.rows.length){
        return res.status(404).json({
            message:"user not found "
        })
    }
    res.json({
        success:true,
        message:"user was found",
        info: result.rows,
    })
     }catch (error) { 
        console.log(error.message)
    }
   
}
const register =async(req, res) => {
    const {email,password,name} = req.body;
    console.log(email)
    try {
        const id= v4()
        const hashedPassword = await hash(password,10)
        await pool.query('insert into users(id,name,email,password) values ($1, $2,$3,$4) ',[ id,name,email,hashedPassword])
        return res.status(201).json({
            success: true,
            message: " the registracion was succefull",
        })
    } catch (error) {
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
    console.log(id);
    console.log(email,password,name);
  
    try {
      if (userId !== id) {
        return res.status(401).json({ message: 'No tienes permiso para editar este perfil.' });
      }
      const hashedPassword = await hash(password,10)
  
      await pool.query('UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4', [
        name,
        email,
        hashedPassword,
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
  
  const uploadImages = async (req, res) => {
    const { id } = req.params;
    const{description}= req.body
    
  
    try {
      // Iterar sobre cada archivo y subirlo
      const uploadResults = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadFiles(file);
          return {
            originalname: result.uniqueFilename,
            url: result.url,
            expires: result.expires,
          };
        })
      );
      const postResult = await pool.query(
        'INSERT INTO posts (title, user_id, status) VALUES ($1, $2, $3) RETURNING id, title, created_at',
        [description, id, 'activo']
      );
    
      const post = postResult.rows[0];
      const postId = post.id;
      console.log(postId);
  
      // Iterar sobre los resultados y realizar la inserción en la base de datos
      await Promise.all(
        uploadResults.map(async (result) => {
          // Insertar la foto
          await pool.query('INSERT INTO photos (name, media_url, post_id) VALUES ($1, $2, $3)', [
            result.originalname,
            result.url,
            postId
          ]);
        })
      );
  
      // Obtener información completa del post con fotos
      const postWithPhotos = await pool.query(
        'SELECT p.*, ph.name AS photo_name, ph.media_url AS photo_url ' +
        'FROM posts p ' +
        'LEFT JOIN photos ph ON p.id = ph.post_id ' +
        'WHERE p.id = $1',
        [postId]
      );
  
      res.json({
        message: 'Fotos insertadas correctamente.',
        post: postWithPhotos.rows[0], // Devuelve el post con la información de las fotos
      });
  
      clearAndRecreateUploadsFolder();
    } catch (error) {
      console.error('Error al subir las fotos:', error);
      res.status(500).json({
        error: error,
      });
    }
  };
  
  
const clearAndRecreateUploadsFolder = () => {
  const folderPath = path.join(__dirname, '..', '..', 'uploads'); // Ajusta según la estructura de tu proyecto

  // Borra la carpeta uploads
  fs.rmSync(folderPath, { recursive: true, force: true });

  // Crea la carpeta uploads de nuevo
  fs.mkdirSync(folderPath);
};

const getImages = async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener todos los posts y las fotos asociadas al usuario
    const result = await pool.query(
      'SELECT p.id AS post_id, p.title, p.user_id,p.created_at, ph.id AS photo_id, ph.name, ph.media_url FROM posts p LEFT JOIN photos ph ON p.id = ph.post_id WHERE p.user_id = $1',
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron posts para el usuario.",
      });
    }

    const userData = {
      user_id: result.rows[0].user_id,
      posts: [],
    };

    // Iterar sobre los resultados y organizar la información
    result.rows.forEach((row) => {
      const postIndex = userData.posts.findIndex((post) => post.post_id === row.post_id);

      // Si el post aún no está en la lista, agregarlo
      if (postIndex === -1) {
        userData.posts.push({
          post_id: row.post_id,
          title: row.title,
          created_at: row.created_at,
          photos: [
            {
              photo_id: row.photo_id,
              name: row.name,
              media_url: row.media_url,
            },
          ],
        });
      } else {
        // Si el post ya está en la lista, agregar la foto a la lista de fotos del post
        userData.posts[postIndex].photos.push({
          photo_id: row.photo_id,
          name: row.name,
          media_url: row.media_url,
        });
      }
    });

    res.json({
      success: true,
      message: "Información de usuario y posts recuperada correctamente.",
      info: userData,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Error al recuperar la información del usuario y los posts.",
    });
  }
};

const deleteImages = async (req, res) => {
  const { postId } = req.params;
  console.log(postId)
  try {
    // Obtener información de las imágenes antes de eliminarlas
    const imagesToDelete = await pool.query('SELECT id,name,media_url FROM photos WHERE post_id = $1', [postId]);

    // Eliminar imágenes de la base de datos
    await pool.query('DELETE FROM photos WHERE post_id = $1', [postId]);
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);

    // Eliminar archivos físicos del almacenamiento (opcional, dependiendo de tus necesidades)
    await Promise.all(
      imagesToDelete.rows.map(async (image) => {
        if (image.name) {
          await deleteFileByName(image.name);
        }
      })
    );

    res.json({
      message: 'Imágenes eliminadas correctamente.',
    });
  } catch (error) {
    console.error('Error al eliminar imágenes:', error);
    res.status(500).json({
      error: error,
    });
  }
};

const editarTitleImages = async (req, res) => {
  const { postId } = req.params;
  const { newDescription } = req.body;
  console.log(newDescription)

  try {
    const postTitleEdit = await pool.query('UPDATE posts SET title=$1 where id= $2', [newDescription,postId]);
    console.log(postTitleEdit)
  } catch (error) {
    
  }
}



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
    uploadImages,
    getImages,
    deleteImages,
    editarTitleImages

}