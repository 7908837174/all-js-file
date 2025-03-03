// setInterval(() => {
//     console.log("hello");
   
// }, 1000); 
// console.log("test");
// console.log("test2");

// const intervalId = setInterval(() => {
//     console.log("hello");
// }, 1000);

// Stop after 5 seconds
// setTimeout(() => {
//     clearInterval(intervalId);
//     console.log("Interval cleared");
// }, 5000);

// function teach(test){
//     console.log("day 1");
//     setTimeout(() =>{
//         console.log("test  in this week");
//     },1000);
//     test();
// }
// function test(){
//     console.log("keep it up")
// }
// teach(test);


// let age = 5;
// age = "five"
// console.log(age);

// let person= {name:"kallal", age:16 };
// console.log(`name ${person.name} , age ${person.age}`);
// let sum=1+2;
// let product= 3*6;

// let day= "sunday";
// switch(day){
//     case "Sunday":
//         console.log("ejffem");
//         break;
//         default :
//         console.log("anthdewund")

// }

// let i=0;
// do{
//     console.log(i);
//     i++;
// }while(i<6);

// let fruits =["mango", "orange", "charry"];
// fruits.push("shivam");
// console.log(fruits);

// let today= new Date;
// console.log(today);
// console.log(today.getFullYear);
// try{
//     let result=12/0;

// }catch(error)
// {
// console.log("idmq")
// }

// let person={
//     name: "bob",
//     greet:function(){

//     }
// }


// let car = {
//     make: "Toyota",
//     model: "Camry",
//     year: 2020
//   };
//   console.log(car);  // Output: "Camry"
  

function createnam(name, age){
    return{
        name : name,
        age : age
    };
 }
 let person2=new createnam("bob", 17);
console.log(person2);
