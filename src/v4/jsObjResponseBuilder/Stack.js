class Stack{
    constructor(){
        this.depth = 100;
        this.length = 0;
        this.arr = new Array(10);
    }

    push(item){
        if(this.length === this.arr.length){
            this.arr[this.length + this.depth] = undefined;
        }
        this.arr[this.length] = item;
        this.length++;
    }

    pop(){
        this.length--;
        return this.arr[this.length];
    }

}
module.exports = Stack;