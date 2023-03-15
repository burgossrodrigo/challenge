`npm i`to build
`npm run test`for test

## ISOLATED FUNCTIONS

`eventHandler` = responsible for determining the partition key for an event. It first checks if the event already has a partition key, and returns it if it does. If not, it calculates a hash of the event data using SHA3-512 and returns it as the partition key

`candidateHandler ` = responsible for validating and sanitizing the candidate partition key. It checks if the candidate is undefined, and sets it to the trivial partition key if it is. If the candidate is a non-string value, it is converted to a string using JSON.stringify. Finally, if the length of the candidate partition key is greater than the maximum allowed length, it is hashed using SHA3-512.

`deterministicPartitionKey` = combines the above two functions to determine the partition key for an event. It first calls eventHandler to get a candidate partition key, and then passes it through candidateHandler for validation and sanitization.

Overall, the refactored code is more modular, easier to understand, and less error-prone compared to the original code.