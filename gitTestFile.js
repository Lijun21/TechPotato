var obj1 = {
    a: 1,
    b: 2,
    c: 3
}

let obj2 = Object.assign({}, obj1, {d: 4});

obj2.e = 5;

console.log(obj2);
console.log(obj1);