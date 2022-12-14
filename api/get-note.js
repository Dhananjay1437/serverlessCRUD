const AWS = require("aws-sdk");

const _=require('underscore');
const headers = require("./headers");
AWS.config.update({
  region: "ap-northeast-1"
 
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;
exports.handler = async (event) => {
    try{
        let note_id=decodeURIComponent(event.pathParameters.note_id);
        let params={
            TableName:tableName,
            IndexName:"note_id-index",
            KeyConditionExpression:"note_id=:note_id",
            ExpressionAttributeValues:{
              ':note_id':note_id
          },
          Limit:1
        }
        let data=await dynamodb.query(params).promise();
        if(!_.isEmpty(data.Items)){
          return {
            "statusCode": 200,
            "isBase64Encoded": false,
            'headers':headers.getResponseHeaders(),
            "body": JSON.stringify(data.Items[0]),
          };

        }
        else{
          return {
            "statusCode": 404,
            "isBase64Encoded": false,
            'headers':headers.getResponseHeaders(),
            "body": JSON.stringify({message:"Not Found"}),
          }; 
        }
      
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