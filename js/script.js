// loader
window.onload=function(){
  let delay=Math.floor(Math.random()*3000)+1000;
  setTimeout(function(){
    document.getElementById("loader").style.display="none";
    document.getElementById("main-content").style.display="block";
  },delay);
}

// ===== DOM READY =====
document.addEventListener("DOMContentLoaded",function(){

  // 🌙 mode nuit
  const toggle=document.getElementById("theme-toggle");
  toggle.onclick=function(){
    document.body.classList.toggle("dark");
    toggle.innerHTML=document.body.classList.contains("dark") ? "☀️" : "🌙";
  }

  // 🔐 connexion
  const loginOverlay=document.getElementById("login-screen");
  const loginBtn=document.getElementById("login-btn");
  const loginToggle=document.getElementById("login-toggle");
  const loginClose=document.getElementById("login-close");
  const errorMsg=document.getElementById("login-error");
  const warningScreen=document.getElementById("warning-screen");

  loginToggle.onclick=function(){
    errorMsg.textContent="";
    loginOverlay.classList.add("show");
  }

  loginClose.onclick=function(){
    loginOverlay.classList.remove("show");
  }

  loginBtn.onclick=function(){
    const username=document.getElementById("username").value.trim();
    const password=document.getElementById("password").value.trim();

    if(!username || !password){
      errorMsg.textContent="Un des deux champs est vide";
      return;
    }

    if(username==="celine" && password==="bauchet"){
      loginOverlay.classList.remove("show");
      setTimeout(()=>{ warningScreen.classList.add("show"); }, 300);
    } else{
      errorMsg.textContent="Identifiant ou mot de passe incorrect";
    }
  }

  // ⚠️ warning hard
  const proceedBtn=document.getElementById("proceed-hard");
  const cancelBtn=document.getElementById("cancel-hard");

  proceedBtn.onclick=function(){
    warningScreen.classList.remove("show");
    launchHardQuiz();
  }

  cancelBtn.onclick=function(){
    warningScreen.classList.remove("show");
  }
});

// ===== QUIZ =====

function Quiz(questions){ 
  this.score=0; 
  this.questions=questions; 
  this.questionIndex=0; 
}

Quiz.prototype.getQuestionIndex=function(){ return this.questions[this.questionIndex]; }
Quiz.prototype.isEnded=function(){ return this.questionIndex===this.questions.length; }

function Question(text,choices,answer){ 
  this.text=text; 
  this.choices=choices; 
  this.answer=answer; 
}

let quiz, selectedAnswer=null;

// ===== IMAGES =====
function getImageForQuestion(index){
  const images = {
    0: "images/spike.png",
    2: "images/outlaw.png",
    3: "images/spike.png",
    6: "images/Iron.jpg",
    7: "images/ascent.jpg",
    8: "images/reyna.png",
    9: "images/spike.png"
  };
  return images[index] || null;
}

// ===== AFFICHAGE =====
function populate(){
  if(quiz.isEnded()){ 
    showScores(); 
    return; 
  }

  selectedAnswer=null;
  document.getElementById("next").disabled=true;

  let q = quiz.getQuestionIndex();
  document.getElementById("question").textContent = q.text;

  // image
  let oldImg = document.getElementById("question-image");
  if(oldImg) oldImg.remove();

  let imgSrc = getImageForQuestion(quiz.questionIndex);
  if(imgSrc){
    let img = document.createElement("img");
    img.src = imgSrc;
    img.id = "question-image";
    img.style.display = "block";
    img.style.margin = "20px auto";
    img.style.maxWidth = "200px";
    document.getElementById("question").after(img);
  }

  for(let i=0;i<4;i++){
    let btn=document.getElementById("btn"+i);
    btn.className="choice";

    if(i<q.choices.length){
      btn.style.display="block";
      btn.textContent=q.choices[i];
      btn.onclick=function(){
        if(selectedAnswer==="locked") return;
        document.querySelectorAll(".choice").forEach(b=>b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedAnswer=q.choices[i];
      }
    } else{
      btn.style.display="none";
    }
  }

  showProgress();
}

document.getElementById("validate").onclick=function(){
  if(selectedAnswer===null) return;

  let q=quiz.getQuestionIndex();

  document.querySelectorAll(".choice").forEach(btn=>{
    if(btn.textContent===q.answer) btn.classList.add("correct");
    if(btn.classList.contains("selected") && btn.textContent!==q.answer) btn.classList.add("wrong");
    btn.onclick=null;
  });

  if(selectedAnswer===q.answer) quiz.score++;

  selectedAnswer="locked";
  document.getElementById("next").disabled=false;
}

document.getElementById("next").onclick=function(){ 
  quiz.questionIndex++; 
  populate(); 
}

function showProgress(){
  let current=quiz.questionIndex+1;
  document.getElementById("progress").textContent="Question "+current+" sur "+quiz.questions.length;
  let percent=((quiz.questionIndex+1)/quiz.questions.length)*100;
  document.getElementById("progress-bar-fill").style.width=percent+"%";
}

// ===== RESULTATS =====
function showScores(){
  let score = quiz.score;
  let rank = "";

  if(score <= 3){
    rank = "Eliss";
  } else if(score <= 5){
    rank = "Eboy/Egirl";
  } else if(score <= 7){
    rank = "Noob";
  } else {
    rank = "Radiant";
  }

  let html = `
    <div class="result-container">
      <h1>Résultats</h1>
      <h2>Score : ${score} / ${quiz.questions.length}</h2>
      <p class="rank-text">
        Bien joué, nous vous avons classé dans : <br> ${rank}
      </p>
      <button class="restart-btn" onclick="location.reload()">
        🔄 Recommencer
      </button>
    </div>
  `;

  document.getElementById("quiz").innerHTML = html;
}

// ===== HARD QUIZ =====
function launchHardQuiz(){
  let hardQuestions=[
    new Question("Q1 : Tu aime le porno ?", ["Oui","Non"], "Oui"),
    new Question("Q2 : Tu aime les hommes ou les femmes ?", ["Les hommes","Les femmes","Les deux"], "Les deux")
  ];
  quiz = new Quiz(hardQuestions);
  populate();
}

// ===== QUESTIONS =====
const questions=[
  new Question("Combien de temps met le spike à exploser ?",["40 secondes","30 secondes","15 secondes","45 secondes"],"45 secondes"),
  new Question("Qui est l'éditeur de Valorant ?",["Steam","Epic Games","Riot","Ubisoft"],"Riot"),
  new Question("Quel sniper est sorti en 2024 ?",["Marshall","Barret","Operator","Outlaw"],"Outlaw"),
  new Question("Combien de temps faut-il pour planter le spike ?",["10 secondes","5 secondes","4 secondes","π"],"4 secondes"),
  new Question("Quelle est la taille du jeu ?",["28,4 Go","20,25 Go","31,45 Go","18,68 Go"],"28,4 Go"),
  new Question("Quels sont les deux groupes existants dans le lore ?",["BETA / GAMMA","Kingston Industries / Kingston Co.","ALPHA / OMEGA","Les gentils / Les méchants"],"ALPHA / OMEGA"),
  new Question("Quelle est la dernière division en mode classé ?",["Fer","Plastic","Audrerie","Radiant"],"Fer"),
  new Question("Combien y a-t-il de sites sur la map Ascent ?",["3","1","2","4"],"2"),
  new Question("Quelle est la classe du personnage Reyna ?",["Contrôleur","Dueliste","Initiateur","Sentinel"],"Dueliste"),
  new Question("Combien de temps faut-il pour désamorcer le spike ?",["7 secondes","3 secondes","10 secondes","5 secondes"],"7 secondes")
];

quiz=new Quiz(questions);
populate();