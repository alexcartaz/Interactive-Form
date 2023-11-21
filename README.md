Form Validation Feature Explanations

Real-Time Error Messages:
-As a user keyups in the required input fields for name, email, and credit card information (number, zip, cvv) if credit card is the selected payment method, validation checks will be run on each key stroke in real time
-Real time validation is also run whenever a user checks or unchecks an activity box (which at least one of is required for form submission)

Conditional Error Message:
-For email address validation, multiple requirements must all be met to validate the input, matching a structure like:
    {username}@{website}.{domain}
-Each time a user keyups inputted text, a validator checks each of these requirements. For any that are not met, a specific hint is added to the innerHTML hint span element

