const crypto = require('crypto')
const { describe, it, expect } = require("@jest/globals");
const { deterministicPartitionKey, candidateHandler, eventHandler, MAX_PARTITION_KEY_LENGTH } = require("./index.js");

//ok
describe("deterministicPartitionKey function", () => {
  it("should return a partition key for a given event object", () => {
    const event = {
      partitionKey: '0x123',
    };
    const partitionKey = deterministicPartitionKey(event);
    expect(partitionKey).toBe("0x123");
  });

  it("should return the partitionKey if it's defined in the event object", () => {
    const event = { partitionKey: "abc" };
    const result = eventHandler(event);
    expect(result).toBe("abc");
  });

  it("should return the hex of the event if partitionKey is undefined in the event object", () => {
    const event = { stuff: 'this', partitionKey: undefined };
    const data = JSON.stringify(event);
    const toBe = crypto.createHash("sha3-512").update(data).digest("hex");
    const result = eventHandler(event);
    expect(result).toBe(toBe);
  });

  it("should return the whole cadidate if it's a string and its lenght is smaller then 256", () => {
    const candidate = "Rodrigo Burgos";
    const partitionKey = candidateHandler(candidate);
    expect(candidate).toBe(partitionKey);
  });
  //nop
  it("should generate a stringfyed value from an object candidate", () => {
    const candidate = 123456
    const partitionKey = candidateHandler(candidate);
    const stringfyedCadidate = JSON.stringify(candidate)
    expect(partitionKey).toBe(stringfyedCadidate);
  });

  //nop
  it("should return TRIVIAL_PARTITION_KEY if candidate is undefined", () => {
    const trivialPartionKey = candidateHandler(undefined)
    expect("0").toBe(trivialPartionKey);
  });

  it("should generate a partition key from a long string candidate", () => {
    const candidate = "a".repeat(300);
    const partitionKey = candidateHandler(candidate);
    const hash = crypto.createHash("sha3-512").update(candidate).digest("hex")
    expect(hash.slice(0, MAX_PARTITION_KEY_LENGTH)).toBe(partitionKey);
  });
});