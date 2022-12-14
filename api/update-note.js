const AWS = require("aws-sdk");

const moment=require('moment');
const headers = require("./headers");
const uuid=require('uuid');
AWS.config.update({
  region: "ap-northeast-1"
 });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;
exports.handler = async (event) => {
    try{
        let item=JSON.parse(event.body);
        item.expires=moment().add(90,'days').unix();
      let data=await  dynamodb.put({
            TableName:tableName,
            Item:item,
            ConditionExpression:'#t=:t',
            ExpressionAttributeNames:{
                '#t':'timestamp'
            },
            ExpressionAttributeValues:{
                ':t':item.timestamp
            }
        }).promise();
        return {
            "statusCode": 200,
            "isBase64Encoded": false,
            
            "body": JSON.stringify({ item}),
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