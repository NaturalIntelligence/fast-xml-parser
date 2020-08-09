const ArrayResponseBuilder = require("./ArrayResponseBuilder")
const PreservedOrderResponseBuilder = require("./PreservedOrderResponseBuilder")
const NormalResponseBuilder = require("./NormalResponseBuilder")

function ResponseBuilderFactory(options){
    if(options.arrayMode){
        return new ArrayResponseBuilder(options);
    }else  if(options.preserveOrder){
        return new PreservedOrderResponseBuilder(options);
    }else{
        return new NormalResponseBuilder(options);
    }
}

module.exports = ResponseBuilderFactory