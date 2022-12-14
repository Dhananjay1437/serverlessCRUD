const AWS = require("aws-sdk");

const moment=require('moment');
const uuid=require('uuid');
const headers = require("./headers");
AWS.config.update({ 
  region: "ap-northeast-1"
 });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;
exports.handler = async (event) => {
    try{
      console.log("table name",tableName);
        let item=JSON.parse(event.body)
        item.note_id=item.user_id + ":" +uuid.v4();
        item.timestamp=moment().unix();
        item.expires=moment().add(90,'days').unix();
        console.log("event details",item);
       await dynamodb.put({
            TableName:tableName,
            Item:item
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
            "body": headers.getResponseHeaders()
    }}
   
  };