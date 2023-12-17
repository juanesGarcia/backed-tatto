const { S3Client, PutObjectCommand,ListObjectsCommand , GetObjectCommand} = require('@aws-sdk/client-s3');
const { AWS_BUCKET_NAME, AWS_PUBLIC_KEY, AWS_SECRET_KEY, AWS_BUCKET_REGION } = require("./constants");
const fs = require("fs");
const { getSignedUrl }= require('@aws-sdk/s3-request-presigner')
// Crear un cliente de S3 utilizando la clase S3Client
const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

const uploadFiles = async (file) => {
  const stream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: file,
    Body: stream,
  };
  const commad = new PutObjectCommand(uploadParams)
  await client.send(commad);
  
};

const getFiles = async ()=>{
  const commad = new ListObjectsCommand({
    Bucket:AWS_BUCKET_NAME
  })
  return await client.send(commad);

}
const getFileUrl = async (file)=>{
  const commad = new GetObjectCommand({
    Bucket:AWS_BUCKET_NAME,
    Key: file
  })
  const expires=9999999999
  const url = await getSignedUrl(client, commad, expires);

  return {
    url,
    expires,
  };
}
module.exports = {
  uploadFiles,
  getFiles, 
  getFileUrl
};

