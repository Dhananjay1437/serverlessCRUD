const AWS = require("aws-sdk");

const headers = require("./headers");
AWS.config.update({
  region: "ap-northeast-1"
 });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;
exports.handler = async (event) => {
    try{
        let timestamp=parseInt(event.pathParameters.timestamp);
        let user_id=event.pathParameters.userId;
        let params={
            TableName:tableName,
            Key:{
                user_id,
                timestamp
            }
        }
        await dynamodb.delete(params).promise();
        return {
            "statusCode": 200,
            "isBase64Encoded": false,
            
            "body": JSON.stringify({message:"data deleted successfully" }),
            'headers':headers.getResponseHeaders(),
          };
    }catch(err){
        console.log(err)
        return {
            "statusCode": err.statusCode?err.statusCode:500,
            "isBase64Encoded": false,
            "body": JSON.stringify({
              error: err.name?err.name:"Exception",
              message:err.message?err.message:"Unknown Error"
            }),
            'headers':headers.getResponseHeaders(),
          }; 
    }
   
  };