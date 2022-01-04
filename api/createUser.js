'use strict';
const uuid = require('uuid');
const AWS = require('aws-sdk');
var createError = require('http-errors');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = async (event, context) => {
  const requestBody = JSON.parse(event.body);
  const { name, email } = requestBody;

  let valid = await validateUser(name, email);
  if (!valid) throw new createError.InternalServerError('Validation Error!');

  const newuser = {
    user_id: uuid.v1(),
    name: name,
    email: email,
  };
  try {
    await dynamoDb
      .put({
        TableName: process.env.USERS_TABLE,
        Item: newuser,
      })
      .promise();
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'User created Successfully ',
      data: newuser,
    }),
  };
};
async function validateUser(name, email) {
  if (typeof name !== 'string' || typeof email !== 'string') {
    console.error('Validation Failed');
    return false;
  }
  return true;
}
