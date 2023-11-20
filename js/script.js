console.log('test');


// Initialization of form

//focus name field
document.querySelector("#name").focus();
//hide other job role by default
let otherJobRoleTextElement = document.querySelector("#other-job-role");
otherJobRoleTextElement.style.display='none';

//drop down menu selections
let titleDropDownMenu = document.querySelector("#title");
titleDropDownMenu.addEventListener("change", (e) => {

    //if other job selected, make text input visible, otherwise hide text input
    if(e.target.value === 'other'){
        otherJobRoleTextElement.style.display = 'block';
    }else{
        otherJobRoleTextElement.style.display = 'none';
    }

});

