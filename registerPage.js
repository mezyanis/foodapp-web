'use strict'
const container = document.querySelector(".container"),
    pwFields = document.querySelector(".password"),
    signIn  = document.querySelector(".item button signUp"),
    logIn =  document.querySelector(".item button");


    signIn.addEventListener('click', ( )=>{
        container.classList.add("active");
    });
    logIn.addEventListener('click', ( )=> {
        container.classList.remove("active");
    });