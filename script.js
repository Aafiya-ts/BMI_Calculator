const history = document.getElementById("history");
const chatContainer = document.getElementById("chatContainer");
let user = localStorage.getItem("current_user");
let historyData = JSON.parse(localStorage.getItem(`history_${user}`)) || [];

// BMI Calculation
function calculateBMI(){
    let h = height.value/100;
    let w = weight.value;

    if(!age.value || !gender.value || !h || !w){
        result.innerHTML="⚠ Fill all details!";
        return;
    }

    let bmi = (w/(h*h)).toFixed(1);
    let status="",color="",tipText="",width=0;

    if(bmi<18.5){status="Underweight"; color="orange"; tipText="Eat healthy"; width=25;}
    else if(bmi<25){status="Normal"; color="green"; tipText="Good job"; width=50;}
    else if(bmi<30){status="Overweight"; color="darkorange"; tipText="Exercise more"; width=75;}
    else{status="Obese"; color="red"; tipText="Consult doctor"; width=100;}

    bar.style.width = width + "%";
    bar.style.background = color;
    result.style.color = color;
    result.innerHTML = `BMI: ${bmi} (${status})`;
    tip.innerHTML = "💡 "+tipText;

    let now = new Date();
    historyData.push(`${now.toLocaleString()} - BMI ${bmi} - ${status}`);
    localStorage.setItem(`history_${user}`, JSON.stringify(historyData));
}

// Reset
function resetData(){
    document.querySelectorAll("input, select").forEach(e=>e.value="");
    result.innerHTML="";
    tip.innerHTML="";
    bar.style.width="0%";
}

// History toggle
function toggleHistory(){
    if(!history.classList.contains("open")){
        loadHistory();
        history.classList.add("open");
    }else{
        history.classList.remove("open");
    }
    chatContainer.classList.remove("open");
    chatContainer.style.display="none";
}

function loadHistory(){
    history.innerHTML="";
    historyData.forEach(item=>{
        let li=document.createElement("li");
        li.innerText = item;
        history.appendChild(li);
    });
}

// Chatbot toggle
function toggleChat(){
    if(!chatContainer.classList.contains("open")){
        chatContainer.classList.add("open");
        chatContainer.style.display="block";

        // Greet user once
        if(chatbox.innerHTML === ""){
            chatbox.innerHTML += `<p><b>Bot:</b> Hi ${user}! 👋 Ask me about BMI or health tips.</p>`;
        }

    }else{
        chatContainer.classList.remove("open");
    }
    history.classList.remove("open");
}

// Chatbot logic
function sendMessage(){
    let msg=userInput.value.toLowerCase();
    chatbox.innerHTML += `<p><b>You:</b> ${msg}</p>`;
    let reply="Ask about BMI or health tips";

    if(msg.includes("bmi")) reply="BMI means Body Mass Index.";
    if(msg.includes("normal")) reply="Normal BMI is 18.5 – 24.9.";
    if(msg.includes("underweight")) reply="BMI less than 18.5 is underweight.";
    if(msg.includes("overweight")) reply="BMI 25 – 29.9 is overweight.";
    if(msg.includes("obese")) reply="BMI 30 or above is obese.";
    if(msg.includes("reduce")) reply="Exercise daily & eat healthy food.";
    if(msg.includes("gain")) reply="Eat nutritious calorie-rich food.";
    if(msg.includes("maintain")) reply="Maintain balanced diet and exercise.";

    chatbox.innerHTML += `<p><b>Bot:</b> ${reply}</p>`;
    userInput.value="";
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Dark mode
function toggleMode(){document.body.classList.toggle("dark");}

// Logout
function logout(){
    localStorage.removeItem("healthmate_login");
    localStorage.removeItem("current_user");
    window.location.href="login.html";
}