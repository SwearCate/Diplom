const calendar_button = document.querySelector("#app-calendar");

for (let day = 1;  day <= 31; day = day + 1){
    console.log(day)

    calendar_button.insertAdjacentHTML("beforeend", '<div class="day">${day}</div>');
}