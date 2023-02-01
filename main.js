const wrapper = document.querySelector(".wrapper"),
inputSection = wrapper.querySelector(".input-section"),
inFormation = inputSection.querySelector(".information"),
inputField = inputSection.querySelector("input"),
locationBtn = inputSection.querySelector("button"),
wIcon = wrapper.querySelector(".weather-section img"),
arrowBack = wrapper.querySelector("header i");

let api;


inputField.addEventListener("keyup", e => {
    //if user enter a value 
    if(e.key== "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", ()=> {
    if(navigator.geolocation){//if browser support geolocation
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
})


function onSuccess(position){
   const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=cd01cf43cbcf65c11188ab996377f107`;
   fetchData();
}


function onError(error){
    inFormation.innerText = error.message;
    inFormation.classList.add("error");
}

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=cd01cf43cbcf65c11188ab996377f107`;
    fetchData();
}

function fetchData(){
    inFormation.innerText = "Getting weather details...";
    inFormation.classList.add("pending");
    //getting api response and returning with parsing into js obj and in another 
    //then function calling weatherDetails function with passing api result as an argument 
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails (info){
    inFormation.classList.replace("pending", "error");
    if(info.cod == "404"){
        inFormation.innerText = `${inputField.value} isn't a valid location`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            wIcon.src="/weather-icon/sun.png";
        }
        else if(id >= 200 && id <= 232){
            wIcon.src="/weather-icon/thunderstorm.png";
        }
        else if(id >= 600 && id <= 622){
            wIcon.src="/weather-icon/snow.png";
        }
        else if(id >= 701 && id <= 781){
            wIcon.src="/weather-icon/haze.png";
        }
        else if(id >= 801 && id <= 804){
            wIcon.src="/weather-icon/cloudy.png";
        }
        else if(id >= 300 && id <= 321 || id >= 500 && id <= 531){
            wIcon.src="/weather-icon/Rain.png";
        }

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText =  Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;
        inFormation.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});
