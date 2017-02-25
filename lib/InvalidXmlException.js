var InvalidXmlException = function (msg){
    this.name = "InvalidXmlException";
    this.message = msg;
    this.stack = (new Error()).stack;
}
InvalidXmlException.prototype = Object.create(Error.prototype);
InvalidXmlException.prototype.constructor = InvalidXmlException;

module.exports = InvalidXmlException;