const history = document.getElementById("history");
const chatContainer = document.getElementById("chatContainer");
const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
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

/* 🔥 AUTO CHATBOT MESSAGE AFTER BMI */
    chatContainer.classList.add("open");
    chatContainer.style.display = "block";
    chatbox.innerHTML += `<p><b>Bot:</b> Your BMI is <b>${bmi}</b> (${status}).  
    You can ask me anything about BMI, diet, exercise, or health 😊</p>`;
    chatbox.scrollTop = chatbox.scrollHeight;
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

function openChatbot(){
    window.open("chatbot.html", "_blank");
}

function toggleSettings(){
    let menu = document.getElementById("settingsMenu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";

    // close others
    history.classList.remove("open");
    chatContainer.classList.remove("open");
}
function askQuestion(question){
    let input = document.getElementById("userInput");
    if(!input) return;

    input.value = question;
    sendMessage();
}

function initChatbot(){
    let chatbox = document.getElementById("chatbox");

    let user = localStorage.getItem("current_user") || "User";
    let key = `chat_${user}`;

    let savedChat = localStorage.getItem(key);

    if(chatbox){
        if(savedChat){
            chatbox.innerHTML = savedChat;
        }else{
            chatbox.innerHTML = `
            <p><b>Bot:</b> Hi ${user}! 👋<br>
            I am your HealthMate assistant.<br>
            Ask me about BMI, diet, nutrition, or exercise 😊</p>`;
        }
    }
}


/* 🔥 SMART ANSWER – NO KEYWORD REQUIRED */

function sendMessage(){
    let msg = userInput.value.toLowerCase().trim();
    if(msg === "") return;

    chatbox.innerHTML += `<div class="user">${msg}</div>`;
    let typing = document.createElement("div");
    typing.className = "bot";
    typing.id = "typing";
    typing.innerHTML = "🤖 Typing...";
    chatbox.appendChild(typing);
    chatbox.scrollTop = chatbox.scrollHeight;


    let reply = "";
    let followUp = "";

    /* ================= BMI SECTION ================= */
    if(msg.includes("is my bmi normal") || msg.includes("bmi normal")){
        reply = "If your BMI is between 18.5 and 24.9, it is considered normal.";
        followUp = `
        👉 Next:<br>
        <span class="q" onclick="askQuestion('how to maintain bmi')">• How to maintain BMI?</span><br>
        <span class="q" onclick="askQuestion('exercise for bmi')">• Exercise to maintain BMI</span><br>
        <span class="q" onclick="askQuestion('diet for normal bmi')">• Diet for normal BMI</span>
        `;
    }

    else if(msg.includes("am i overweight")){
        reply = "BMI between 25 and 29.9 is considered overweight.";
        followUp = `
        👉 Next:<br>
        <span class="q" onclick="askQuestion('how to reduce bmi')">• How to reduce BMI?</span><br>
        <span class="q" onclick="askQuestion('is my bmi normal')">• Is my BMI normal?</span><br>
        <span class="q" onclick="askQuestion('bmi categories')">• BMI Categories?</span><br>
        `;
    }

    else if(msg.includes("reduce bmi")){
        reply = "You can reduce BMI by exercise, diet, and healthy habits.";
        followUp = `
        👉 Select a BMI question:<br>
        <span class="q" onclick="askQuestion('is my bmi normal')">• Is my BMI normal?</span><br>
        <span class="q" onclick="askQuestion('am i overweight')">• Am I overweight?</span><br>
        <span class="q" onclick="askQuestion('bmi categories')">• BMI Categories?</span><br>
        `;
    }

    else if(msg.includes("bmi categories")){
        reply = "BMI categories are Underweight, Normal, Overweight, and Obese.";
        followUp = `
        👉 Select:<br>
        <span class="q" onclick="askQuestion('underweight')">• Underweight</span><br>
        <span class="q" onclick="askQuestion('exercise for bmi')">• Exercise to maintain BMI</span><br>
        <span class="q" onclick="askQuestion('overweight')">• Overweight</span>
        `;
    }
    else if(msg === "underweight"){
    reply = "Underweight means your BMI is below 18.5. It may indicate insufficient nutrition or health issues.";
    followUp = `
    👉 Next:<br>
    <span class="q" onclick="askQuestion('diet for weight gain')">• Diet for Weight Gain</span><br>
    <span class="q" onclick="askQuestion('nutrients')">• Nutrients</span><br>
    <span class="q" onclick="askQuestion('bmi categories')">• BMI Categories</span>
    `;
}

    else if(msg === "overweight"){
    reply = "Overweight means your BMI is between 25 and 29.9. It increases risk of lifestyle diseases if not managed.";
    followUp = `
    👉 Next:<br>
    <span class="q" onclick="askQuestion('diet for weight loss')">• Diet for Weight Loss</span><br>
    <span class="q" onclick="askQuestion('exercise for bmi')">• Exercise for BMI</span><br>
    <span class="q" onclick="askQuestion('bmi categories')">• BMI Categories</span>
    `;
}
    else if(msg.includes("maintain bmi")){
        reply = "To maintain a healthy BMI, follow a balanced diet, exercise regularly, avoid junk food, drink enough water, and sleep well.";
        followUp = `
        👉 Next questions:<br>
        <b>📌 BMI:</b><br>
        <span class="q" onclick="askQuestion('diet for normal bmi')">• Diet for normal BMI</span><br>
        <span class="q" onclick="askQuestion('exercise for bmi')">• Exercise to maintain BMI</span><br>
        <br><b>🥗 Nutrients:</b><br>
        <span class="q" onclick="askQuestion('nutrients')">• What are nutrients?</span><br>
        <span class="q" onclick="askQuestion('protein')">• Why is protein important?</span><br>
        <span class="q" onclick="askQuestion('carbohydrates')">• Role of carbohydrates</span>
        `;
    }
/* ================= EXERCISE SECTION ================= */
else if(msg.includes("exercise for bmi")){
    reply = "Walking, jogging, yoga, and light strength training help maintain BMI.";
    followUp = `
    👉 Next:<br>
    <span class="q" onclick="askQuestion('diet for normal bmi')">• Diet for Normal BMI</span><br>
    <span class="q" onclick="askQuestion('balanced diet')">• Balanced Diet</span><br>
    <span class="q" onclick="askQuestion('nutrients')">• Nutrients</span><br>
    <span class="q" onclick="askQuestion('bmi categories')">• BMI Categories</span>
    `;
}

else if(msg.includes("exercise for weight loss")){
    reply = "For weight loss, focus on cardio like running, cycling, HIIT, and combine with strength training.";
    followUp = `
    👉 Next:<br>
    <span class="q" onclick="askQuestion('diet for weight loss')">• Diet for Weight Loss</span><br>
    <span class="q" onclick="askQuestion('exercise for bmi')">• Exercise for BMI</span>
    `;
}

else if(msg.includes("exercise for weight gain")){
    reply = "For weight gain, strength training and resistance exercises are most effective. Pair with a protein-rich diet.";
    followUp = `
    👉 Next:<br>
    <span class="q" onclick="askQuestion('diet for weight gain')">• Diet for Weight Gain</span><br>
    <span class="q" onclick="askQuestion('nutrients')">• Nutrients</span>
    `;
}

else if(msg.includes("yoga for health")){
    reply = "Yoga improves flexibility, reduces stress, and supports BMI maintenance.";
    followUp = `
    👉 Next:<br>
    <span class="q" onclick="askQuestion('balanced diet')">• Balanced Diet</span><br>
    <span class="q" onclick="askQuestion('exercise for bmi')">• Exercise for BMI</span>
    `;
}

else if(msg.includes("exercise")){
    reply = "Exercise helps maintain a healthy BMI, supports weight management, and improves overall fitness.";
    followUp = `
    👉 Select an exercise topic:<br>
    <span class="q" onclick="askQuestion('exercise for bmi')">• Exercise for BMI</span><br>
    <span class="q" onclick="askQuestion('exercise for weight loss')">• Exercise for Weight Loss</span><br>
    <span class="q" onclick="askQuestion('exercise for weight gain')">• Exercise for Weight Gain</span><br>
    <span class="q" onclick="askQuestion('yoga for health')">• Yoga for Health</span>
    `;
}
else if(msg.trim() === "bmi"){
    reply = "BMI (Body Mass Index) helps to check whether a person's weight is healthy or not.";
    followUp = `
    👉 Select a BMI question:<br>
    <span class="q" onclick="askQuestion('is my bmi normal')">• Is my BMI normal?</span><br>
    <span class="q" onclick="askQuestion('am i overweight')">• Am I overweight?</span><br>
    <span class="q" onclick="askQuestion('bmi categories')">• BMI Categories?</span><br>
    `;
}
    /* ================= NUTRIENTS SECTION ================= */
    else if(msg.includes("carbohydrate")){
        reply = "Carbohydrates give energy to the body. Healthy carbs include rice, fruits, and whole grains.";
        followUp = `
        👉 Next:<br>
        <span class="q" onclick="askQuestion('protein')">• Protein</span><br>
        <span class="q" onclick="askQuestion('vitamins')">• Vitamins</span><br>
        <span class="q" onclick="askQuestion('minerals')">• Minerals</span><br>
        <span class="q" onclick="askQuestion('bmi')">• BMI</span><br>
        `;
    }

    else if(msg.includes("protein")){
        reply = "Protein helps muscle growth, body repair, and immunity.";
        followUp = `
        👉 Next:<br>
        <span class="q" onclick="askQuestion('carbohydrates')">• Carbohydrates</span><br>
        <span class="q" onclick="askQuestion('vitamins')">• Vitamins</span><br>
        <span class="q" onclick="askQuestion('minerals')">• Minerals</span><br>
        <span class="q" onclick="askQuestion('bmi')">• BMI</span><br>
        `;
    }

    else if(msg.includes("vitamin")){
        reply = "Vitamins protect the body from diseases and keep organs healthy.";
        followUp = `
        👉 Next:<br>
        <span class="q" onclick="askQuestion('protein')">• Protein</span><br>
        <span class="q" onclick="askQuestion('minerals')">• Minerals</span><br>
        <span class="q" onclick="askQuestion('carbohydrates')">• Carbohydrates</span><br>
        <span class="q" onclick="askQuestion('bmi')">• BMI questions</span>
        `;
    }

    else if(msg.includes("mineral")){
        reply = "Minerals like calcium and iron strengthen bones and improve blood circulation.";
        followUp = `
        👉 Next:<br>
        <span class="q" onclick="askQuestion('vitamins')">• Vitamins</span><br>
        <span class="q" onclick="askQuestion('protein')">• Protein</span><br>
        <span class="q" onclick="askQuestion('carbohydrates')">• Carbohydrates</span><br>
        <span class="q" onclick="askQuestion('bmi')">• BMI questions</span>
        `;
    }

    else if(msg.includes("nutrient") || msg.includes("nutrition")){
        reply = "Nutrients are substances that provide energy, help growth, and maintain body functions.";
        followUp = `
        👉 Select a nutrient:<br>
        <span class="q" onclick="askQuestion('carbohydrates')">• Carbohydrates</span><br>
        <span class="q" onclick="askQuestion('protein')">• Protein</span><br>
        <span class="q" onclick="askQuestion('vitamins')">• Vitamins</span><br>
        <span class="q" onclick="askQuestion('minerals')">• Minerals</span>
        `;
    }

    /* ================= DIET SECTION ================= */
    else if(msg.includes("diet for weight loss")){
        reply = "For weight loss, eat vegetables, fruits, lean protein, whole grains, and avoid junk food and sugar.";
        followUp = `
        👉 Next:<br>
        <span class="q" onclick="askQuestion('exercise for weight loss')">• Exercise for weight loss</span><br>
        <span class="q" onclick="askQuestion('nutrients')">• Nutrients</span>
        `;
    }

    else if(msg.includes("diet for weight gain")){
        reply = "For weight gain, eat calorie-rich nutritious food like nuts, milk, eggs, rice, and pulses.";
        followUp = `
        👉 Next:<br>
        <span class="q" onclick="askQuestion('protein')">• Protein importance</span><br>
        <span class="q" onclick="askQuestion('nutrients')">• Nutrients</span>
        `;
    }

    else if(msg.includes("diet for normal bmi")){
        reply = "A normal BMI diet includes vegetables, fruits, whole grains, protein foods, and enough water.";
        followUp = `
        👉 Next:<br>
        <span class="q" onclick="askQuestion('carbohydrates')">• Carbohydrates</span><br>
        <span class="q" onclick="askQuestion('protein')">• Protein</span><br>
        <span class="q" onclick="askQuestion('vitamins')">• Vitamins</span><br>
        <span class="q" onclick="askQuestion('nutrients')">• Nutrients</span>
        `;
    }
    else if(msg.includes("balanced diet")){
    reply = "A balanced diet includes carbohydrates, protein, fats, vitamins, minerals, fiber, and water in correct amounts.";
    followUp = `
    👉 Next:<br>
    <span class="q" onclick="askQuestion('carbohydrates')">• Carbohydrates</span><br>
    <span class="q" onclick="askQuestion('protein')">• Protein</span><br>
    <span class="q" onclick="askQuestion('vitamins')">• Vitamins</span><br>
    <span class="q" onclick="askQuestion('minerals')">• Minerals</span>
    `;
}
    else if(msg.includes("diet")){
    reply = "Diet refers to the food and drinks a person consumes daily. A healthy diet includes fruits, vegetables, whole grains, proteins, and adequate water.";
    followUp = `
    👉 Next:<br>
    <span class="q" onclick="askQuestion('diet for weight loss')">• Diet for weight loss</span><br>
    <span class="q" onclick="askQuestion('diet for weight gain')">• Diet for weight gain</span><br>
    <span class="q" onclick="askQuestion('balanced diet')">• Balanced diet</span><br>
    <span class="q" onclick="askQuestion('exercise for bmi')">• Exercise to maintain BMI</span><br>
    <span class="q" onclick="askQuestion('diet for normal bmi')">• Diet for normal BMI</span>
    `;
}
/* ================= DEFAULT ================= */
else {
    reply = "I can help you with BMI, nutrients, and diet.";
    followUp = `
    👉 Start here:<br>
    <span class="q" onclick="askQuestion('bmi')">• BMI</span><br>
    <span class="q" onclick="askQuestion('nutrients')">• Nutrients</span><br>
    <span class="q" onclick="askQuestion('diet')">• Diet</span>
    `;
}
setTimeout(() => {
    document.getElementById("typing")?.remove();

    chatbox.innerHTML += `<div class="bot">${reply}<br><br>${followUp}</div>`;
    userInput.value = "";
    chatbox.scrollTop = chatbox.scrollHeight;

    let user = localStorage.getItem("current_user") || "User";
    localStorage.setItem(`chat_${user}`, chatbox.innerHTML);
}, 500);   // ⏱️ 0.5 seconds
}
// Dark mode
function toggleMode(){document.body.classList.toggle("dark");}

// Logout
function logout(){
    if(confirm("Are you sure you want to logout?")){
        let user = localStorage.getItem("current_user");
        localStorage.removeItem(`chat_${user}`);
        localStorage.removeItem("healthmate_login");
        localStorage.removeItem("current_user");
        window.location.href = "login.html";
    }
}

// Close settings when clicking outside
document.addEventListener("click", function(e){
    let menu = document.getElementById("settingsMenu");
    let settingsBtn = document.querySelector(".settings-btn");

    if(!menu.contains(e.target) && !settingsBtn.contains(e.target)){
        menu.style.display = "none";
    }
});
function clearHistory(){
    if(confirm("Clear all BMI history?")){
        historyData = [];
        localStorage.removeItem(`history_${user}`);
        history.innerHTML = "";
        alert("BMI history cleared ✅");
    }
}
function clearChat(){
    if(confirm("Clear all chat messages?")){
        let chatbox = document.getElementById("chatbox");
        let user = localStorage.getItem("current_user") || "User";

        chatbox.innerHTML = `
        <p><b>Bot:</b> Hi ${user}! 👋<br>
        Chat cleared. Ask me again 😊</p>`;

        localStorage.setItem(`chat_${user}`, chatbox.innerHTML);
    }
}
function openChatbot(){
    window.open("chatbot.html", "_blank");
}

