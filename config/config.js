// Copy this file as config.js in the same folder, with the proper database connection URI.
// More info for setting up credentials for AWS DynamoDB.
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html
module.exports = {
  aws_table_name: 'YOUR_TABLE_NAME',
  aws_local_config: {
    region: 'local',
    endpoint: 'http://localhost:8000'
  }
};