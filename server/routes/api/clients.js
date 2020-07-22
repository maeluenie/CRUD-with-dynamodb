const AWS = require('aws-sdk');
const config = require('../../../config/config.js');
const isDev = process.env.NODE_ENV !== 'production';
module.exports = (app) => {
  
    // Add new client
  app.post('/api/clients', (req, res, next) => {
    if (isDev) {
      AWS.config.update(config.aws_local_config);
    } else {
      AWS.config.update(config.aws_remote_config);
    }
    const { clientName, username } = req.body;
    // Generate random string ID
    const clientId = (Math.random() * 1000).toString();
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_name,
      Item: {
        clientId: clientId,
        clientName: clientName,
        username: username
      }
    };
    docClient.put(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else {
        console.log('data', data);
        const { Items } = data;
        res.send({
          success: true,
          message: 'Add client',
          clientId: clientId
        });
      }
    });
  });

    // Get all clients
  app.get('/api/clients', (req, res, next) => {
    if (isDev) {
      AWS.config.update(config.aws_local_config);
    } else {
      AWS.config.update(config.aws_remote_config);
    }
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_name
    };
    docClient.scan(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else {
        const { Items } = data;
        res.send({
          success: true,
          message: 'Loaded clients',
          clients: Items
        });
      }
    });
  });
  
  // Get by id
  app.get('/api/client', (req, res, next) => {
    if (isDev) {
      AWS.config.update(config.aws_local_config);
    } else {
      AWS.config.update(config.aws_remote_config);
    }
    const clientId = req.query.id;
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: config.aws_table_name,
      KeyConditionExpression: 'clientId = :i',
      ExpressionAttributeValues: {
        ':i': clientId
      }
    };
    docClient.query(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else {
        console.log('data', data);
        const { Items } = data;
        res.send({
          success: true,
          message: 'Loaded clients',
          clients: Items
        });
      }
    });
  });

  // delete by id
  app.delete('/api/client', ( req, res, next) => {
    if (isDev) {
      AWS.config.update(config.aws_local_config);
    } else {
      AWS.config.update(config.aws_remote_config);
    }
    const clientId = req.query.id;
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: config.aws_table_name,
      Key:{
        clientId: clientId
      }
    };
    console.log('deleting item');
    docClient.delete(params, function(err, data) {
      if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else {
        console.log('deleted');
        res.send({
          success: true,
          message: 'Deleted clients',
        });
      }
    });
  });

  // Update by id
  app.patch('/api/client', ( req, res, next) => {
    if (isDev) {
      AWS.config.update(config.aws_local_config);
    } else {
      AWS.config.update(config.aws_remote_config);
    }
    const { clientName, username } = req.body;
    const clientId = req.query.id;
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: config.aws_table_name,
      Key:{
        clientId: clientId
      },
      UpdateExpression: "set clientName = :n, username = :u",
      ExpressionAttributeValues: {
        ':n': clientName,
        ':u': username
      },
      ReturnValues: "UPDATED_NEW"
    };
    console.log({clientName, username})
    console.log('updating item');
    docClient.update(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else {
        console.log('data', data);
        const { Items } = data;
        res.send({
          success: true,
          message: 'Updated clients',
          clients: Items
        });
      }
    });
  });
};