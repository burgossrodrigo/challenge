const crypto = require('crypto')
const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

const eventHandler = (e) => {
    const { partitionKey } = e
    if(![e, partitionKey].includes(undefined)){
        return partitionKey
    }

    if(e !== undefined && partitionKey === undefined){
      const data = JSON.stringify(e);
      return crypto.createHash("sha3-512").update(data).digest("hex");
    }
}

const candidateHandler = (c) => {
        switch (typeof c) {
            case "undefined":
                c = TRIVIAL_PARTITION_KEY
                break
            case "string":
                break    
            default:
                c = JSON.stringify(c)
        }
   
    if(typeof c === 'string' && c.length > MAX_PARTITION_KEY_LENGTH){
        c = crypto.createHash("sha3-512").update(c).digest("hex");
    }
    return c
}



const deterministicPartitionKey = (event) => {
    let candidate
    candidate = eventHandler(event)
    candidateHandler(candidate)
    return candidate
}

module.exports = { 
        deterministicPartitionKey, 
        candidateHandler, 
        eventHandler, 
        TRIVIAL_PARTITION_KEY, 
        MAX_PARTITION_KEY_LENGTH 
    }