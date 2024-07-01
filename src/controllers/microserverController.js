const { sign } = require("jsonwebtoken");
const pool = require("../databases/db");
const { hash } = require("bcryptjs");
const { SECRET } = require("../databases/env");
const { v4 } = require("uuid");
const { checkTokenValidity } = require("../middlewares/checkTokenValidity");
const {
  uploadFiles,
  deleteFileByName,
  getFileNameFromUrl,
  deleteFileByNamepro,
} = require("../firabase");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const main = async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/");
    res.json(response.data);
    console.log("microserver", response.data);
  } catch (error) {
    console.error(error);
  }
};

const getUserMicro = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`http://localhost:3000/user/${id}`);
    res.json(response.data);
    console.log("microserver", response.data);
  } catch (error) {
    console.error(error);
  }
};

const getusersMicroservices = async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/users");
    res.json(response.data);
    console.log("microserver", response.data);
  } catch (error) {
    console.error(error);
  }
};

const getUsersWithRatingMicro = async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/userwithrating");
    res.json(response.data);
    console.log("microserver", response.data);
  } catch (error) {
    console.error(error);
  }
};

const updateUserMicro = async (req, res) => {
  const { id } = req.params;
  const { password, name } = req.body;

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
};

const getUserInfoMicro = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`http://localhost:3000/userInfo/${id}`);
    res.json(response.data);
    console.log("microserver", response.data);
  } catch (error) {
    console.error(error);
  }
};

const deleteUserMicro = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.delete(`http://localhost:3000/user/${id}`);
    res.json(response.data);
    console.log("microserver", response.data);
  } catch (error) {
    console.error(error);
  }
};

const registerMicro = async (req, res) => {
  const { email, password, name, rol, phone } = req.body;
  try {
    const response = await axios.post("http://localhost:3005/register", {
      email,
      password,
      name,
      rol,
      phone,
    });

    res.json(response.data);
    console.log("Respuesta del microservicio:", response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

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

const logoutMicro= async (req,res)=>{
    try {
      const response = await axios.get(`http://localhost:3005/logout`);
      res.json(response.data);
      console.log("microserver",response.data)
    } catch (error) {
      console.error(error);
    }
  }
  
  
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