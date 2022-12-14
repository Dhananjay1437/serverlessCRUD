const AWS = require("aws-sdk");
const headers = require("./headers");
AWS.config.update({
  region: "ap-northeast-1"

});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;
exports.handler = async (event) => {
    try{
        let query=event.queryStringParameters;
        let limit=query && query.limit?parseInt(query.limit):10;
        let user_id=event.pathParameters.userId;
        let params={
            TableName:tableName,
            KeyConditionExpression:"user_id = :uuid",
            ExpressionAttributeValues:{
                ':uuid':user_id
            },
            Limit:limit,
            ScanIndexForward:false

        };
        let startTimestamp=query && query.start?parseInt(query.start):0;
        if(startTimestamp>0){
            params.ExclusiveStartKey={
                user_id:user_id,
                timestamp:startTimestamp
            }
        }
        let Items=await dynamodb.query(params).promise();
        return {
            "statusCode": 200,
            "isBase64Encoded": false,
            
            "body": JSON.stringify(Items),
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