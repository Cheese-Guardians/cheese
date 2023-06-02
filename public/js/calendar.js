if (typeof calendarDataResult !== 'undefined' && calendarDataResult && typeof calendarDataResult.calendar.sleep_time !== 'undefined' && calendarDataResult.calendar.sleep_time && typeof calendarDataResult.calendar.sleep_time !== 'undefined') {
    console.log("sleep_time: " + calendarDataResult.calendar.sleep_time)
    // Get the sleep_time value from the calendar object
    const sleepTime = calendar.sleep_time;    
    const buttons = document.getElementsByClassName('btn');

    // Find the corresponding button based on the sleep_time value

    for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const span = button.querySelector('span');
    const buttonText = span.innerText.trim();
    
        // Compare the sleep_time value with the button text
        if (buttonText === sleepTime) {
            // Add the 'active' class to the button and check the associated checkbox
            button.classList.add('active');
            const checkbox = button.querySelector('input[type="checkbox"]');
            checkbox.checked = true;
            break;
        }
    }
}
