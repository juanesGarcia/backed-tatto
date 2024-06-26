
const { sign } = require("jsonwebtoken");
const pool = require("../databases/db");
const {hash} = require('bcryptjs');
const { SECRET } = require("../databases/env");
const{v4}=require("uuid");
const { checkTokenValidity } = require("../middlewares/checkTokenValidity");
const { uploadFiles,deleteFileByName,getFileNameFromUrl,deleteFileByNamepro} =require("../firabase")
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const main=async(req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/');
    res.json(response.data);
    console.log("microserver",response.data)
  } catch (error) {
    console.error(error);
  }
 
}

const getUsers =async(req, res) => {
    try {
     const result = await pool.query('select (id,name,rol,lon,lat,city) from users');
      res.json(result.rows)
    } catch (error) {
        console.log(error.message)
    }
   
}
const getusersMicroservices= async (req,res)=>{
      try {
        const response = await axios.get('http://localhost:3000/users');
        res.json(response.data);
        console.log("microserver",response.data)
      } catch (error) {
        console.error(error);
      }
}

const getUsersWithRatingMicro= async (req,res)=>{
  try {
    const response = await axios.get('http://localhost:3000/userwithrating');
    res.json(response.data);
    console.log("microserver",response.data)
  } catch (error) {
    console.error(error);
  }
}

const updateUserMicro = async (req, res) => {
  const { id } = req.params;
  const { password, name} = req.body;
  

  try {

    const response = await axios.put(
      `http://localhost:3000/user/${id}`,
      { password, name } // Enviar los datos correctos al microservicio en el cuerpo de la solicitud
    );
    
    res.json(response.data);
    console.log("Respuesta del microservicio:", response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { password, name } = req.body;
  console.log(name)

  try {
    const hashedPassword = await hash(password, 10);

    await pool.query('UPDATE users SET name = $1, password = $2 WHERE id = $3', [
      name,
      hashedPassword,
      id
    ]);

    res.json({ success: true, message: 'Perfil actualizado correctamente.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};



const getUserMicro= async (req,res)=>{
  const {id} = req.params;
  try {
    const response = await axios.get(`http://localhost:3000/user/${id}`);
    res.json(response.data);
    console.log("microserver",response.data)
  } catch (error) {
    console.error(error);
  }
}




const getUser =async(req, res) => {
    const {id} = req.params;
    console.log(id)
    try {
     const result = await pool.query('select (name,email,rol,phone,city,media_url) from users where id = $1',[id]);
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
const getUserInfo =async(req, res) => {
  const {id} = req.params;
  console.log(id)
  try {
   const result = await pool.query('select (name) from users where id = $1',[id]);
   if(!result.rows.length){
      return res.status(404).json({
          message:"user not found "
      })
  }
  res.json(
    result.rows)
   }catch (error) { 
      console.log(error.message)
  }
 
}
const getUserInfoMicro= async (req,res)=>{
  const {id} = req.params;
  try {
    const response = await axios.get(`http://localhost:3000/user/${id}`);
    res.json(response.data);
    console.log("microserver",response.data)
  } catch (error) {
    console.error(error);
  }
}


const deleteUser = async (req, res) => {
  const { id } = req.params;

  console.log(id)

  try {
 
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

const deleteUserMicro= async (req,res)=>{
  const {id} = req.params;
  try {
    const response = await axios.delete(`http://localhost:3000/user/${id}`);
    res.json(response.data);
    console.log("microserver",response.data)
  } catch (error) {
    console.error(error);
  }
}



const register =async(req, res) => {
    const {email,password,name,rol,phone} = req.body;
    console.log(req.body)
    console.log(rol)
    try {
        const id= v4()
        const hashedPassword = await hash(password,10)
        await pool.query('insert into users(id,name,email,password,rol,phone) values ($1, $2,$3,$4,$5,$6) ',[ id,name,email,hashedPassword,rol,phone])
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

const registerMicro = async (req, res) => {
  const {email,password,name,rol,phone} = req.body;
  try {
    const response = await axios.post(
      'http://localhost:3005/register',
      {email,password,name,rol,phone}
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}

const login= async (req,res)=>{
  let payload = req.body;
  console.log('prueba ', payload)
    try {
        const token = sign(payload,SECRET,{expiresIn:'2m'})
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
const loginMicro = async (req, res) => {
  let user = req.user
  payload={
      id: user.id,
      email: user.email,
      name: user.name, 
      phone:user.phone,
      rol:user.rol,
      media_url:user.media_url,
  }
  console.log(payload)
  try {
    const response = await axios.post(
      'http://localhost:3005/login',
      payload, // Enviar los datos correctos al microservicio en el cuerpo de la solicitud
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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

const logoutMicro= async (req,res)=>{
  try {
    const response = await axios.get(`http://localhost:3005/logout`);
    res.json(response.data);
    console.log("microserver",response.data)
  } catch (error) {
    console.error(error);
  }
}


  


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

  const uploadImagesMicro = async (req, res) => {
    const { id } = req.params;
    const{description}= req.body
    try {
      const response = await axios.post(
        `http://localhost:3001/uploadimg/${id}`,
        {description}
      );
  
      res.json(response.data);
      console.log('Respuesta del microservicio:', response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  
  }
  
  
  
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
    if (result.rows.length === 0) {
      // Si no hay resultados, devolver un array vacío
      return res.json({
        success: true,
        message: "El usuario no tiene posts ni imágenes asociadas.",
        info: {
          user_id: id,
          posts: [],
        },
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

const getImagesMicro = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(
      `http://localhost:3001/getimages/${id}`
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}

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

const deleteImagesMicro = async (req, res) => {
  const { postId } = req.params;
  try {
    const response = await axios.delete(
      `http://localhost:3001/deleteimages/${postId}`
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}

const editarTitleImages = async (req, res) => {
  const { postId } = req.params;
  const { newDescription ,currentTime} = req.body;
  console.log(currentTime)


  try {
    const postTitleEdit = await pool.query('UPDATE posts SET title=$1,updated_at=$2 where id= $3', [newDescription,currentTime,postId]);
    console.log(postTitleEdit)
    res.json({
      message: 'descripcion actualizada correctamente.',
    });
  } catch (error) {
    return res.status(500).json({
      error:error.message
  })
  }
}

const editarTitleImagesMicro = async (req, res) => {
  const { postId } = req.params;
  const { newDescription ,currentTime} = req.body;
  try {
    const response = await axios.put(
      `http://localhost:3001/editar/${postId}`,
      { newDescription ,currentTime}
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}

const follow = async (req, res) =>{
  const {follower_id,followed_id} = req.body;

  try {

    await pool.query('insert into follows (follower_user_id,followed_user_id) values ($1, $2) ',[ follower_id,followed_id])
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

const followMicro = async (req, res) => {
  const {follower_id,followed_id} = req.body;
  try {
    const response = await axios.post(
      'http://localhost:3002/followUser',
    {follower_id,followed_id}
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}

const unfollow = async (req, res) => {
  const { follower_id, followed_id } = req.body;

  try {
    await pool.query('DELETE FROM follows WHERE follower_user_id = $1 AND followed_user_id = $2', [follower_id, followed_id]);

    return res.status(200).json({
      success: true,
      message: 'Unfollow successful',
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const unfollowMicro = async (req, res) => {
  const {follower_id,followed_id} = req.body;
  try {
    const response = await axios.post(
      'http://localhost:3002/unFollowUser',
    {follower_id,followed_id}
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}

const follower = async (req, res) =>{
  const {id} = req.params;

  try {
    const result = await pool.query('SELECT u.name AS follower_name, u.id AS follower_id,u.media_url AS media_url FROM follows f JOIN users u ON f.follower_user_id = u.id WHERE f.followed_user_id = $1',[id]);

   res.json({
       info: result.rows
   })
    }catch (error) { 
       console.log(error.message)
   }

}

const followerMicro= async (req,res)=>{
  const {id} = req.params;
  try {
    const response = await axios.get(`http://localhost:3002/follower/${id}`);
    res.json(response.data);
    console.log("microserver",response.data)
  } catch (error) {
    console.error(error);
  }
}



const followed = async (req, res)=>{
  const {id} = req.params;

  try {
    const result = await pool.query('SELECT u.name AS followed_name, u.id AS followed_id,u.media_url AS media_url FROM follows f JOIN users u ON f.followed_user_id = u.id WHERE f.follower_user_id = $1',[id]);
   res.json({
       info: result.rows
   })
    }catch (error) { 
       console.log(error.message)
   }

}

const followedMicro= async (req,res)=>{
  const {id} = req.params;
  try {
    const response = await axios.get(`http://localhost:3002/followed/${id}`);
    res.json(response.data);
    console.log("microserver",response.data)
  } catch (error) {
    console.error(error);
  }
}


const checkFollowingStatus = async (req,res) => {
  console.log(req.body)
  const {followed_id,follower_id}=req.body
  try {
    const result = await pool.query('SELECT EXISTS (SELECT 1 FROM follows WHERE follower_user_id = $1 AND followed_user_id = $2) AS sigue_al_usuario',[follower_id,followed_id]);
    res.json({
      info: result.rows
  })
   
    }catch (error) { 
       console.log(error.message)
   }

};


const checkFollowingMicro = async (req, res) => {
  const {follower_id,followed_id} = req.body;
  try {
    const response = await axios.post(
      'http://localhost:3002/checkfollowing',
    {follower_id,followed_id}
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}


const reactions = async (req,res) => {
  const {reactor_id, reacted_to_user_id,  post_id, reaction_type} = req.body

  try {
    await pool.query('insert into reactions (reactor_id, reacted_to_user_id,  post_id, reaction_type) values ($1,$2,$3,$4) ',[ reactor_id, reacted_to_user_id,  post_id, reaction_type])
    return res.status(201).json({
        success: true,
        message: " the registracion was succefull",
    })
    
  } catch (error) {
    
  }

}

const reactionsMicro = async (req, res) => {
  const {reactor_id, reacted_to_user_id,  post_id, reaction_type} = req.body
  try {
    const response = await axios.post(
      'http://localhost:3003/reaction',
    {reactor_id, reacted_to_user_id,  post_id, reaction_type}
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}


const unreaction = async (req, res) => {
  const { reactor_id, post_id} = req.body;

  try {
    await pool.query(
      'DELETE FROM reactions WHERE reactor_id = $1 AND post_id = $2',
      [reactor_id, post_id]
    );

    return res.status(200).json({
      success: true,
      message: 'The unreaction was successful.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while unreaction.',
    });
  }
};

const unReactionsMicro = async (req, res) => {
  const { reactor_id, post_id} = req.body;
  try {
    const response = await axios.post(
      'http://localhost:3003/unreaction',
      { reactor_id, post_id}
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}

const getReaction = async (req, res) => {
  const {id} = req.params;
  console.log('get reaccions',id)
  
  try {
    const result = await pool.query('SELECT users.id , users.name, users.media_url AS media_url FROM users JOIN reactions ON users.id = reactions.reactor_id WHERE reactions.post_id = $1',[id]);
   res.json({
       info: result.rows
   })
   console.log(result.rows)
    }catch (error) { 
       console.log(error.message)
   }
}
const getReactionMicro= async (req,res)=>{
  const {id} = req.params;
  try {
    const response = await axios.get(`http://localhost:3003/getreactions/${id}`);
    res.json(response.data);
    console.log("microserver",response.data)
  } catch (error) {
    console.error(error);
  }
}


const checkreactions = async (req,res) => {
  const {reactor_id, post_id} = req.body

  try {
   const result= await pool.query(' SELECT COUNT(*) AS reaction_count FROM reactions WHERE reactor_id = $1 AND post_id = $2;',[ reactor_id,post_id])
    res.json({
      info: result.rows
  })
  } catch (error) {
    console.log(error)
  }

}

const checkreactionsMicro = async (req, res) => {
  const { reactor_id, post_id} = req.body;
  try {
    const response = await axios.post(
      'http://localhost:3003/checkreactions',
      { reactor_id, post_id}
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}

const updatelocation = async (req,res)=>{
  const {id,lon,lat,cityUser} =req.body
  const currentTimestamp = new Date();

  try {
    const result= await pool.query('UPDATE users SET lon=$1,lat=$2,city=$3, updated_at=$4 WHERE id =$5',[lon,lat,cityUser,currentTimestamp,id])
    res.json({
      success:true
  })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });    
  }
}

const updatelocationMicro = async (req, res) => {
  const {id,lon,lat,cityUser} =req.body
  try {
    const response = await axios.post(
      'http://localhost:3000/updatelocation',
      {id,lon,lat,cityUser}
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}


const rating = async(req,res)=>{
  const {rater_user, tatuador_user,rating} =req.body;
  console.log('rating',rater_user,tatuador_user,rating)
  console.log(req.body) 

  try {
    const result= await pool.query('insert into ratings ( rater_user_id, tatuador_user_id,rating) values ($1, $2,$3) ',[rater_user,tatuador_user,rating])
    res.json({
      message:'calificacion exitosa'
  })
  } catch (error) {
    return res.status(500).json({
      error: 'ya hicite el rating ',
    });    
  }

}
const ratingMicro = async (req, res) => {
  const {rater_user, tatuador_user,rating} =req.body;
  try {
    const response = await axios.post(
      'http://localhost:3004/rating',
      {rater_user, tatuador_user,rating}
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}

const getRating = async(req,res)=>{
  const {id} = req.params;

  try {
    const result= await pool.query('SELECT AVG(rating) AS average_rating , COUNT(rating) AS rating_count FROM ratings WHERE tatuador_user_id = $1 GROUP BY tatuador_user_id;',[id])
    res.json({
      info: result.rows
    })
  } catch (error) {
    return res.status(500).json({
      error: error,
    });    
  }

}

const getRatingMicro= async (req,res)=>{
  const {id} = req.params;
  try {
    const response = await axios.get(`http://localhost:3004/getRating/${id}`);
    res.json(response.data);
    console.log("microserver",response.data)
  } catch (error) {
    console.error(error);
  }
}




const yetRating = async (req,res)=>{
  const {rater_user, tatuador_user} =req.body
  console.log(rater_user,tatuador_user)

  try {
    const result= await pool.query('SELECT EXISTS (SELECT 1 from ratings WHERE rater_user_id = $1 AND tatuador_user_id = $2) AS rating_yet;',[rater_user,tatuador_user])
    res.json({
      info:result.rows
  })
  console.log(result.rows)
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });    
  }
}

const yetRatingMicro = async (req, res) => {
  const {rater_user, tatuador_user} =req.body
  try {
    const response = await axios.post(
      'http://localhost:3004/yetrating',
      {rater_user, tatuador_user}
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

}

const getUsersWithRating = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.name,
        u.rol,
        u.lon,
        u.lat,
        u.city,
        u.media_url,
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COUNT(r.id) AS rating_count
      FROM
        users u
      LEFT JOIN
        ratings r ON u.id = r.tatuador_user_id
      GROUP BY
        u.id, u.name, u.rol, u.lon, u.lat, u.city
    `);

    res.json(result.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: error.message,
    });
  }
};
const uploadImagesProfile = async (req, res) => {
  const { id } = req.params;

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

    const newPhotoUrl = uploadResults[0].url;

    // Obtener la URL de la imagen actual del usuario
    const result = await pool.query('SELECT media_url FROM users WHERE id = $1', [id]);
    const currentPhotoUrl = result.rows[0].media_url;

    // Verificar si hay una imagen actual y eliminarla
    if (currentPhotoUrl !== null) {
      const currentFileName = getFileNameFromUrl(currentPhotoUrl);
      await deleteFileByNamepro(currentFileName);
    }

    // Actualizar la URL de la imagen en la tabla 'users'
    const updateUserResult = await pool.query('UPDATE users SET media_url = $1 WHERE id = $2 RETURNING media_url', [
      newPhotoUrl,
      id,
    ]);

    const updatedUserMediaUrl = updateUserResult.rows[0].media_url;

    res.json({
      message: 'Imagen de perfil actualizada correctamente.',
      mediaUrl: updatedUserMediaUrl,
    });
    
    clearAndRecreateUploadsFolder();
  } catch (error) {
    console.error('Error al subir la foto de perfil:', error);
    res.status(500).json({
      error: 'Error al subir la foto de perfil',
    });
  }
};

const uploadImagesProfileMicro = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.post(
      `http://localhost:3000/uploadimg/${id}`
    );

    res.json(response.data);
    console.log('Respuesta del microservicio:', response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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
    editarTitleImages,
    follow,
    follower,
    followed,
    checkFollowingStatus,
    unfollow,
    reactions,
    checkreactions,
    unreaction,
    getReaction,
    updatelocation,
    rating,
    getRating,
    yetRating,
    getUsersWithRating,
    uploadImagesProfile,
    getUserInfo,
    getusersMicroservices,
    main,
    getUsersWithRatingMicro,
    updateUserMicro,
    getUserMicro,
    deleteUserMicro,
    getUserInfoMicro,
    logoutMicro,
    loginMicro,
    registerMicro,
    followMicro,
    unfollowMicro,
    checkFollowingMicro,
    followerMicro,
    followedMicro,
    reactionsMicro,
    unReactionsMicro,
    checkreactionsMicro,
    getReactionMicro,
    ratingMicro,
    yetRatingMicro,
    getRatingMicro,
    updatelocationMicro,
    uploadImagesProfileMicro,
    uploadImagesMicro,
    getImagesMicro,
    deleteImagesMicro,
    editarTitleImagesMicro

}