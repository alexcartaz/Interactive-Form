// *****
// FORM INITIALIZATION AND DYNAMIC LOGIC

// -----
// TITLE LOGIC
// -----

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

// -----
// COLOR SELECTION LOGIC
// -----

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

// -----
// TOTAL ACTIVITY COST LOGIC
// -----

let activitiesFieldSet = document.querySelector('#activities');
let activitiesSelected = 0;
// changes handler
activitiesFieldSet.addEventListener('change', (e) => {
    //on any change we reset total to 0
    let total = 0;
    let activitiesLabels = document.querySelector('#activities-box').children;
    activitiesSelected = 0;
    //loop through all options and sum total of checked activities
    for(const label of activitiesLabels){
        let checkbox = label.children[0];
        if(checkbox.checked){
            total+=Number(checkbox.getAttribute('data-cost'));
            activitiesSelected++;
        }
    }
    //update new total displayed to user
    document.querySelector('#activities-cost').innerHTML = "Total: $" + total;
});

// -----
// PAYMENT LOGIC
// -----

// defaults
// credit card selected
document.querySelector("#payment").children[1].selected = true;
// other payment flows hidden
let paymentInfo = {
    'credit-card': document.querySelector('#credit-card'),
    'paypal': document.querySelector('#paypal'),
    'bitcoin': document.querySelector('#bitcoin')
}
paymentInfo['credit-card'].style.display = 'block';
paymentInfo['paypal'].style.display = 'none';
paymentInfo['bitcoin'].style.display = 'none';

//listen to changes
let paymentSelection = document.querySelector('#payment');
paymentSelection.addEventListener('change', (e) => {
    //hide all payment info
    paymentInfo['credit-card'].style.display = 'none';
    paymentInfo['paypal'].style.display = 'none';
    paymentInfo['bitcoin'].style.display = 'none';
    //make visible the selected payment info
    paymentInfo[e.target.value].style.display = 'block';
});

// -----
// FORM VALIDATION
// -----

function formValidation(){
    let name = document.querySelector("#name").value;
    //name has at least 1 letter
    let nameValidation = /[a-zA-Z]/.test(name);
    let email = document.querySelector("#email").value;
    //email is at least _@_.__ or _@_.___
    let emailValidation = /[^\s@]+@[^\s@]+\.[^\s@]{2,3}/.test(email);
    //at least 1 activity selected
    let activityValidation = false;
    if(activitiesSelected > 0){
        activityValidation = true;
    }
    //validation if credit card is selected payment option
    let creditCardValidation = true;
    //if credit card is selected payment method (otw we have nothing to validate)
    if(paymentInfo['credit-card'].style.display === 'block'){

        let cNumber = document.querySelector("#cc-num").value;
        let zipCode = document.querySelector("#zip").value;
        let CVV = document.querySelector("#cvv").value;

        let cNumValidation = /^\d{13,16}$/.test(cNumber);
        let zipValidation = /^\d{5}$/.test(zipCode);
        let cvvValidation = /^\d{3}$/.test(CVV);

        if(!(cNumValidation && zipValidation && cvvValidation)){
            creditCardValidation = false;
        }
    }

    if( nameValidation && emailValidation && activityValidation && creditCardValidation ){
        return true;
    }
    return false;
}

let form = document.querySelectorAll('form')[0];
form.addEventListener('submit', (e) => {
    console.log('submission attempt')
    if(!formValidation()){
        e.preventDefault();
        //prevent form submission
        //ideally direct user to errors/missing info
    }
});

// -----
// Activity checkbox focus
// -----

let checkboxes = document.querySelectorAll("input[type='checkbox']");
//for each checkbox...
for(const checkbox of checkboxes){
    //add event handler to add focus
    checkbox.addEventListener("focus", (e) =>{
        checkbox.parentElement.classList.add("focus");
    });
    //add event handelr to remove focus
    checkbox.addEventListener("blur", (e) => {
        checkbox.parentElement.classList.remove("focus");
    });
}


