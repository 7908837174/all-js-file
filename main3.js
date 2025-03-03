// const fetchData =new Promise((resolve, reject) =>{
//     setTimeout(() => resolve("play freefier!"),1000);
// });
// fetchData.then(data=>console.log(data));

// function greet(name, callback){
//     console.log("Hello"+ name)
//     callback();
// }
// function dnf(){
//     console.log("Goodbay!");
// }
// greet("kl", dnf);

// const intervelId= setInterval(() =>{
//     console.log("ksk dkw");
// },1000);
// setTimeout(() =>clearInterval(intervelId),3000);
 
// try{
//     const data= JSON.parse('{""Name:-kallal}')
// }catch(error){
//     console.log("kallal", error.message)
// }

// const number=[1,23,4,5,6,77];
// const evenNumbers= number.filter(num => num%2 ==0);
// console.log(evenNumbers);

// const number=[1,2,3,4,5,67,7];
// const doubled=number.map(num =>num*2);
// console.log(doubled);

// const number=[1,2,3,4,55,6,7,8];
// const sum=number.reduce((acc,num)=>acc+num,0);
// console.log(sum);

// const person={nume:"kallal"};
// console.log(Object.keys(person));
// console.log(Object.entries(person));

// function makeCounter(){
//     let count=0;
//     return function(){
//         count++;
//         return count;
//     }
// }
// const counter=makeCounter();
// console.log(counter);
// console.log(counter);

// const str="123";
// const num=Number(str);

// let arr = [1, 4, 5];
// arr.splice(1, 0, 2, 3); 
// console.log(arr)

// let arr=[12,2,3,4,56,6];
// console.log(arr.includes(2));
//let arr=[1,2,3,4,5,6,67];
// arr.splice(1,2);
// console.log(arr);
// arr.splice(0,arr.length);
// console.log(arr);

// let arr = [1, 2, 3];
// while (arr.length) {
//     arr.pop(); // arr will be emptied
// }

// let arr=[1,2,3,4,5,56,7];
// arr.forEach(element=>console.log(element));

// const add=function(a,b){
//     return a+b;
// }
// console.log(add(1,2));

// function greet(name = 'kallal'){
//     return `hello ${name}`;
// }
// console.log(greet);
// console.log(greet("Alex"));

let date = new Date;
console.log(date.getTime);
console.log(date.getFullYear);
console.log(date.getDay);
