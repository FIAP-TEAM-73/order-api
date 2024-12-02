import { Given, When, Then } from '@cucumber/cucumber';
import axios from 'axios';
import assert from 'assert';

Given('the API endpoint is {string}', function (apiEndpoint) {
  this.endpoint = `http://localhost:9002${apiEndpoint}`;
});

Given('the following query parameters:', function (dataTable) {
  dataTable.hashes().forEach((param: Record<string, any>) => {
    this.queryParams = {[param.key]: param.value};
  });
});

When('I send a GET request to the endpoint', async function () {
    const url = new URL(this.endpoint);
    Object.keys(this.queryParams).forEach((key) =>
      url.searchParams.append(key, this.queryParams[key])
    );
    this.response = await axios.get(url.toString());
});

Then('the response status should be {int}', function (statusCode) {
  const { status } = this.response
  assert.strictEqual(status, statusCode, `Expected status ${statusCode}, got ${status}`);
});

Then('the response should have the following fields:', function (dataTable) {
  const responseBody = this.response.data;
  dataTable.hashes().forEach((field: { field: string }) => {
    assert.ok(
      responseBody.hasOwnProperty(field.field),
      `Response is missing field: ${field.field}`
    );
  });
});

Then('the {string} field should contain:', function (fieldName, dataTable) {
  const fieldContent = this.response.data[fieldName];
  assert.ok(Array.isArray(fieldContent), `${fieldName} should be an array`);
  dataTable.hashes().forEach((field: { field: string }) => {
    fieldContent.forEach((item) => {
      assert.ok(
        item.hasOwnProperty(field.field),
        `Content item is missing field: ${field.field}`
      );
    });
  });
});
