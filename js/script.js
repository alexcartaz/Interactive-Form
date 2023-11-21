// *****
// FORM INITIALIZATION AND DYNAMIC LOGIC


//focus name field
document.querySelector("#name").focus();
let isPayingWithCC = true;

// -----
// TITLE LOGIC
// -----

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
let activitySchedule = {
    "Tuesday 9am-12pm": false,
    "Tuesday 1pm-4pm": false,
    "Wednesday 9am-12pm": false,
    "Wednesday 1pm-4pm": false
};
// changes handler
activitiesFieldSet.addEventListener('change', (e) => {
    //on any change we reset total to 0
    let total = 0;
    let activitiesLabels = document.querySelector('#activities-box').children;
    activitiesSelected = 0;

    //update selected schedule
    //if selection has a specifcied time
    if(e.target.getAttribute("name") != "all"){
        //if checked, include in schedule
        if(e.target.checked === true){
            activitySchedule[e.target.parentElement.children[2].innerHTML] = true;
        }else{
            //if unchecked, remove from schedule
            activitySchedule[e.target.parentElement.children[2].innerHTML] = false;
        }
    }

    //loop through all options and sum total of checked activities
    // also hide any lectures conflicting in time slot with any activities already selected
    for(const label of activitiesLabels){
       
        let checkbox = label.children[0];
        if(checkbox.checked){
            //total cost
            total+=Number(checkbox.getAttribute('data-cost'));
            activitiesSelected++;
        }else{
            //if unchecked and has a day/time
            if(label.getAttribute("name")!="all"){
                //if this activity's day/time is taken
                if(activitySchedule[label.children[2].innerHTML]){
                    //disable this duplicate
                    label.classList.add("disabled");
                    checkbox.disabled = true;
                }else{
                    //otw make sure this is not disabled as no activity for this day/time has been selected by user
                    label.classList.remove("disabled");
                    checkbox.disabled = false;
                }
            }
        }
        if(activitySchedule[label.children[2].innerHTML]){
            label.classList.add("disabled");
        }

    }
    //update new total displayed to user
    document.querySelector('#activities-cost').innerHTML = "Total: $" + total;
    //update real time form validation
    formValidation();
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

//function that abstracts validation and hints
//hintText is optional; currently only conditionally used for email
function applyValidClass(element, valid, hint, hintText = ''){
    if(valid){
        element.classList.remove("not-valid");
        element.classList.add("valid");
        console.log('1')
        hint.style.display = "none";
    }else{
        element.classList.add("not-valid");
        element.classList.remove("valid");
        console.log('2')
        hint.style.display = "block";
        //if hintText is passed into function and if hint is displayed, update hint text
        if(hintText != ''){
            hint.innerHTML = hintText;
        }
    }
}

//toggle correct labels for each required frield based on specifications, including hints
function applyValidationLabels(nameValidation, emailValidation, emailHintText, activityValidation, isPayingWithCC, cNumValidation, zipValidation, cvvValidation){

    applyValidClass(document.querySelector("#name").parentElement, nameValidation, document.querySelector("#name-hint"));
    applyValidClass(document.querySelector("#email").parentElement, emailValidation, document.querySelector("#email-hint"), emailHintText);
    applyValidClass(document.querySelector("#activities"), activityValidation, document.querySelector("#activities-hint"));
    if(isPayingWithCC){
        applyValidClass(document.querySelector("#cc-num").parentElement, cNumValidation, document.querySelector("#cc-hint"));
        applyValidClass(document.querySelector("#zip").parentElement, zipValidation, document.querySelector("#zip-hint"));
        applyValidClass(document.querySelector("#cvv").parentElement, cvvValidation, document.querySelector("#cvv-hint"));
    }

};

//takes each validation component for email input string and updates the hint text with whatever requirement is missing, from 0-4
function generateEmailHintText(eV_pre, eV_at, eV_website, eV_domain){
    let msg = "Email address must be formatted correctly:<br>{username}@{website}.{domain}<br>";
    if(!eV_pre){
        msg += '<br>-missing {username}  (eg john.smith)'
    }
    if(!eV_at){
        msg += '<br>-missing @ symbol';
    }
    if(!eV_website){
        msg += '<br>-missing {website}  (eg apple)';
    }
    if(!eV_domain){
        msg += '<br>-missing {domain}  (eg .net or .com)';
    }
    return msg;
}

//performs all validation of required fields from user
function formValidation(){
    let name = document.querySelector("#name").value;
    //name has at least 1 letter
    let nameValidation = /[a-zA-Z]/.test(name);
    let email = document.querySelector("#email").value;
    //email is at least _@_.__ or _@_.___
    let emailValidation = /[^\s@]+@[^\s@]+\.[^\s@]{2,3}$/.test(email);
    let eV_pre = /^[^\s@]+/.test(email);
    let eV_at = /@/.test(email);
    let eV_website = /@[^\s@.]+\./.test(email);
    let eV_domain = /\.[^\s@]{2,3}$/.test(email);
    //generate piecemeal validation text hints
    let emailHintText = generateEmailHintText(eV_pre, eV_at, eV_website, eV_domain);

    //at least 1 activity selected
    let activityValidation = false;
    if(activitiesSelected > 0){
        activityValidation = true;
    }
    //validation if credit card is selected payment option
    let creditCardValidation = true;

    //determine if cc is payment method (this is an important conditional for several things)
    if(paymentInfo['credit-card'].style.display === 'block'){
        isPayingWithCC = true;
    }else{
        isPayingWithCC = false;
    }

    //if paying with cc, perform cc specific validations
    let cNumValidation, zipValidation, cvvValidation;
    if(isPayingWithCC){

        let cNumber = document.querySelector("#cc-num").value;
        let zipCode = document.querySelector("#zip").value;
        let CVV = document.querySelector("#cvv").value;

        cNumValidation = /^\d{13,16}$/.test(cNumber);
        zipValidation = /^\d{5}$/.test(zipCode);
        cvvValidation = /^\d{3}$/.test(CVV);

        if(!(cNumValidation && zipValidation && cvvValidation)){
            creditCardValidation = false;
        }
    }
    
    //apply validation labels
    applyValidationLabels(nameValidation, emailValidation, emailHintText, activityValidation, isPayingWithCC, cNumValidation, zipValidation, cvvValidation);

    //apply final validation check
    if( nameValidation && emailValidation && activityValidation && creditCardValidation ){
        return true;
    }
    return false;
}

// -----
// All Keyup Validation Listeners
// -----

//name
document.querySelector("#name").addEventListener("keyup", (e) => {
    formValidation();
});
//email
document.querySelector("#email").addEventListener("keyup", (e) => {
    formValidation();
});
//cc, if it is selected payment option
if(isPayingWithCC){
    document.querySelector("#cc-num").addEventListener("keyup", (e) => {
        formValidation();
    });
    document.querySelector("#zip").addEventListener("keyup", (e) => {
        formValidation();
    });
    document.querySelector("#cvv").addEventListener("keyup", (e) => {
        formValidation();
    });
}
//activity selection


// final validation on form submission attempt
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


