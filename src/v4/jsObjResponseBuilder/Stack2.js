const Stack = function(){
    this.top = null;
    this.size = 0;
};

const Node = function(data){
    this.data = data;
    this.previous = null;
};

Stack.prototype.push = function(data) {
    const node = new Node(data);

    node.previous = this.top;
    this.top = node;
    this.size += 1;
    return this.top;
};

Stack.prototype.pop = function() {
    const temp = this.top;
    this.top = this.top.previous;
    this.size -= 1;
    return temp;
};

module.exports = Stack;