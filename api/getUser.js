'use strict';
const uuid = require('uuid');
const AWS = require('aws-sdk');
var createError = require('http-errors');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getUserById(id) {
  try {
    const result = await dynamoDb
      .get({
        TableName: process.env.USERS_TABLE,
        Key: { user_id: id },
      })
      .promise();
    var user = result.Item;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }
  if (!user)
    throw new createError.InternalServerError(
      'No User Exist with following id!'
    );

  return user;
}
module.exports.getUser = async (event, context) => {
  const id = event.pathParameters.id;
  let user = await getUserById(id);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'User Fetched Successfully ',
      data: user,
    }),
  };
};
