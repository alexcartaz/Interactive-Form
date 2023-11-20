console.log('test');


// Initialization of form

//focus name field
document.querySelector("#name").focus();
//hide other job role by default
let otherJobRoleTextElement = document.querySelector("#other-job-role");
otherJobRoleTextElement.style.display='none';

//title drop down menu selections
let titleDropDownMenu = document.querySelector("#title");
titleDropDownMenu.addEventListener("change", (e) => {

    //if other job selected, make text input visible, otherwise hide text input
    if(e.target.value === 'other'){
        otherJobRoleTextElement.style.display = 'block';
    }else{
        otherJobRoleTextElement.style.display = 'none';
    }

});

//color initialization
let colorSelection = document.querySelector("#color");
colorSelection.disabled = true;

//color enablement upon design motif selection
let designSelector = document.querySelector("#design");
designSelector.addEventListener("change", (e) => {

    //if design moitif selected, color selection is now enabled
    colorSelection.disabled = false;

    //iterate over every possible color option and only display those matching chosen motif
    for (const option of colorSelection.children){
        if(option.getAttribute("data-theme") === e.target.value){
            option.style.display = 'block';
        }else{
            option.style.display = 'none';
        }
    }
});