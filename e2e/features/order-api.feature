Feature: Order API

  Scenario: Retrieve orders by query parameters
    Given the API endpoint is "/api/v1/order"
    And the following query parameters:
      | key          | value |
      | page         | 1     |
      | size         | 1     |
    When I send a GET request to the endpoint
    Then the response status should be 200
    And the response should have the following fields:
      | field        |
      | content      |
      | pageSize     |
      | page         |
      | totalPages   |
      | isFirstPage  |
      | isLastPage   |
    And the "content" field should contain:
      | field        |
      | id           |
      | tableNumber  |
      | status       |
      | orderItems   |
      | total        |
