/*******************************************create DOM for index, game, end, high score********************************* */
function createElement(ele, eleClass = '', eleId = '') {
  const element = document.createElement(ele);
  eleClass !== '' ? element.setAttribute('class', eleClass) : '';
  eleId !== '' ? element.setAttribute('id', eleId) : '';
  return element;
}
/*******************************************indexpage******************************************************************** */

function homepage() {
  const containerh = createElement('div', 'container', 'conclass');
  const row = createElement('div', 'row');
  const column = createElement('div', ' col-12', 'conclass');
  const wrapperh = createElement('div', 'wrapper');
  const head = createElement('h5', 'title');
  head.innerHTML = 'QUICK QUIZ';


  const playbtn = createElement('a', 'btn btnprimary');
  playbtn.setAttribute('id', 'play')
  playbtn.innerHTML = 'PLAY';
  playbtn.href = '/gamepage.html'

  const hsbtn = createElement('a', 'btn btnprimary');
  hsbtn.setAttribute('id', 'highscores')
  hsbtn.innerHTML = 'HIGHSCORE';
  hsbtn.href = '/highscore.html';

  wrapperh.append(head, playbtn, hsbtn);
  column.append(wrapperh);
  row.append(column);
  containerh.append(row);
  document.body.append(containerh);
}

let markssecured = 0;
  let QA = 0;
  let QNUM = 0;
  
  async function GamePage(){
    // Fetch questions from opentdb 
    const questionsRawData = await getquestions();
  
    //to make the raw data from the qb to be structered
    const uniformdataclean = uniformdata(questionsRawData);
  
    // Generate game page layout
    gamepagehtml(uniformdataclean);
  
    configurationsettings();
  }
  
  async function getquestions(){
    const url = 'https://opentdb.com/api.php?amount=10&category=11&type=multiple';
    try{
      const res = await fetch(url);
      const data = await res.json();
      return data;
    } catch(err){
      console.log(err);
    }
  }
  
  function uniformdata(questionsRawData){
    return questionsRawData.results.map(ele => {
        const obj = {};
        obj.question = ele.question;
        let count = 1;
        obj.answers = ele.incorrect_answers.map(answer => {
          return {answer: answer, isCorrect: false}
        })   
        obj.answers.push({answer: ele.correct_answer, isCorrect: true});
      
        obj.answers.sort((a,b) => (a.answer > b.answer) ? -1 : ((b.answer > a.answer) ? 1 : 0));
        obj.answers = obj.answers.map(answer => {
          return {...answer, num: count++,}
        }) 
        return obj;
    });
  }
  
  function gamepagehtml(questionsData){
    const containerG = createElement('div', 'container', 'gamePageContainer');
    const rowG = createElement('div', 'row');
    const colG = createElement('div', 'col-12 text-center');
    const resultsDiv = resultgen();
    colG.append(resultsDiv);
    for(let i = 0; i < questionsData.length; i++ ){
      const qDiv = quizhtml(questionsData[i], i);
      if(i === QNUM){
        qDiv.classList.remove('hide');
      }
      colG.append(qDiv);
    }
  
    colG.append();
    rowG.append(colG);
    containerG.append(rowG);
    document.body.append(containerG);
  }
  
  function resultgen(){
      const div = createElement('div', 'results');
        const divQsDone = createElement('div');
          const pQsDoneText = createElement('p');
          pQsDoneText.append(document.createTextNode('Questions Done'));
          const pQsDone = createElement('p', '', 'qsDone');
          pQsDone.innerHTML = '0/10';
        divQsDone.append(pQsDoneText, pQsDone);  
  
        const divResultsRange = createElement('div');
          const pResultsRangeText = createElement('p');
          pResultsRangeText.append(document.createTextNode('Range'));
          const progressResultsRange = createElement('progress', '', 'progressResultsRange');
          progressResultsRange.value = 0;
          progressResultsRange.max = 10;
        divResultsRange.append(pResultsRangeText, progressResultsRange);  
  
        const divScore = createElement('div');
          const pScoreText = createElement('p');
          pScoreText.append(document.createTextNode('Score'))
          const pScore = createElement('p', '', 'pScore');
          pScore.innerHTML = 0;
        divScore.append(pScoreText, pScore);
  
        div.append(divQsDone, divResultsRange, divScore);
      return div;
  }
  
  function quizhtml(quizq, index){
    const id = 'q'+index;
      const qDiv = createElement('div', 'hide', id);
        const question = createElement('div', 'question', '');
          const questionPara = createElement('p');
          const questionParaText = document.createTextNode('Q' + (index+1)+': ' + replace(quizq.question)); // Replaces &#039; with ' and &quot; with "
          questionPara.append(questionParaText);
        question.append(questionPara);
      qDiv.append(question);    
  
      quizq.answers.forEach(answerObj => {
        const answerDiv = answerhtml(answerObj);
        qDiv.append(answerDiv);
      })
  
    return qDiv;
  } 
  
  
  function replace(str){
    if(str.includes('&#039;')){
      str = str.replaceAll('&#039;', "'");
    } 
    if(str.includes('&quot;')){
      str = str.replaceAll('&quot;', '"');
    }
    return str;
  }
  
  function answerhtml(answerObj){
      const answerDiv = createElement('div', 'answer');
        const answerNum = createElement('p', 'answerNum');
        answerNumText = document.createTextNode(answerObj.num);
        answerNum.append(answerNumText);
        const answerValue = createElement('p', 'answerValue');
          answerValueText = document.createTextNode(replace(answerObj.answer)); // Replaces &#039; with ' and &quot; with "
        answerValue.append(answerValueText);
      answerDiv.append(answerNum, answerValue);
      let value = answerObj.answer;
      let isCorrect = answerObj.isCorrect;
      let d = this;
      answerDiv.setAttribute('onclick',`updateResults(this, "${value}", "${isCorrect}")`);
    return answerDiv;
  }
  
  function configurationsettings(){
    markssecured = 0;
    questionsAnswered = 0;
    if(localStorage.getItem('score')){
      localStorage.setItem('score', null);
    }
  } 
  
  async function showQuestion(questionNum){
    await delay(1000);
    document.getElementById(`q${questionNum-1}`).classList.add('hide');
    await delay(1000);
    document.getElementById(`q${questionNum}`).classList.remove('hide');
  }
  
  function delay(time){
    return new Promise((res, rej) => {
      setTimeout(() => {
        res();
      }, time)
    })
  }
  
  function updateResults(ele, value, isCorrect){
    const parentElement = ele.parentElement;
    parentElement.style.pointerEvents = 'none';
    //pointer-events: none;
    if(isCorrect === "true"){
      ele.classList.add('correct');
      markssecured++;
    } else{
      ele.classList.add('wrong');
    }
  
    questionsAnswered++;
    document.getElementById('qsDone').innerHTML = `${questionsAnswered}/10`
    document.getElementById('pScore').innerHTML = markssecured * 10; 
    document.getElementById('progressResultsRange').value = markssecured;
    
    updateLocalStorage(markssecured * 10);
    
    if(questionsAnswered === 10){
      movetoEndPage();
    } else{
      QNUM++;
      showQuestion(QNUM);
    }
  }
  
  function updateLocalStorage(markssecured){
      localStorage.setItem('score', markssecured);
  }
  
  async function movetoEndPage(){
    resetGame();
    //Introduces delay
    await delay(1000);
    document.getElementById(`q9`).classList.add('hide');
    setTimeout(()=>{
      window.location.replace("/endpage.html");
    }, 1000);
  }
  
  function resetGame(){
    markssecured = 0;
    QA = 0;
    QNUM = 0;
  }

// endpage.html
function endpage() {
  end();
  showscore_in_endPage();
}

function end() {
  const containerE = createElement('div', 'container');
  const rowE = createElement('div', 'row');
  const colE = createElement('div', 'col-md-6 offset-md-5 endpage');

  const showscore = createElement('p', 'conatainer');
  showscore.innerHTML = 'score:';

  const inputUserName = createElement('input', 'mt-2', 'userName');
  inputUserName.placeholder = 'User Name';
  inputUserName.type = 'text';
  inputUserName.addEventListener('keyup', enableSave);

  const statusEndPage = createElement('p', 'text-center hide', 'statusEndPage');
  statusEndPage.innerHTML = '';

  const saveBtn = createElement('button', 'btn btn-info mt-3', 'saveScoreBtn');
  saveBtn.innerHTML = "Save";
  saveBtn.disabled = true;
  saveBtn.addEventListener('click', saveScore)

  const playAgainBtn = createElement('button', 'btn btn-primary mt-3', 'playAgain');
  playAgainBtn.innerHTML = 'Play Again';
  playAgainBtn.addEventListener('click', goToPlayAgain);

  const goHomeBtn = createElement('button', 'btn mt-3', 'goHome');
  goHomeBtn.innerHTML = 'Go Home';
  goHomeBtn.addEventListener('click', goToHome);
  colE.append(showscore, inputUserName, statusEndPage, saveBtn, playAgainBtn, goHomeBtn);
  rowE.append(colE);
  containerE.append(rowE);
  document.body.append(containerE);
}

function showscore_in_endPage() {
  if (localStorage.getItem('score') !== null) {
    document.getElementById('scoreEndPage').innerHTML = 'Score ' + localStorage.getItem('score');
  }
}

function enableSave() {
  const userName = document.getElementById('userName').value;
  if (userName) {
    document.getElementById('saveScoreBtn').disabled = false;
  } else {
    document.getElementById('saveScoreBtn').disabled = true;
  }
}

async function saveScore() {
  let highScores = [];
  if (localStorage.getItem('highScores')) {
    highScores = JSON.parse(localStorage.getItem('highScores'));
  } else {
    highScores = [];
  }
  const score = localStorage.getItem('score');
  const userName = document.getElementById('userName').value;
  if (checkUserNameExists(userName, highScores)) {

    document.getElementById('statusEndPage').innerHTML = `User Name "${userName}" Already exists`;
    document.getElementById('statusEndPage').classList.remove('hide');
    document.getElementById('userName').value = '';
    document.getElementById('saveScoreBtn').disabled = true;
    await delay(2000);


    document.getElementById('statusEndPage').innerHTML = '';
    document.getElementById('statusEndPage').classList.add('hide');
    document.getElementById('userName').focus();
    return;
  }
  const highScore = { userName, score }
  highScores.push(highScore);
  //Show user name added message for 2 seconds
  document.getElementById('statusEndPage').innerHTML = `User Name added to the high scores list`;
  document.getElementById('statusEndPage').classList.remove('hide');
  document.getElementById('saveScoreBtn').disabled = true;
  document.getElementById('userName').value = '';
  document.getElementById('userName').disabled = true;
  await delay(2000);
  //Hide message after 2 seconds
  document.getElementById('statusEndPage').innerHTML = '';
  document.getElementById('statusEndPage').classList.add('hide');
  localStorage.setItem('highScores', JSON.stringify(highScores));
}

function checkUserNameExists(userName, highScores) {
  let userExists = false;
  highScores.forEach(user => {
    console.log(user.userName, userName);
    if (user.userName === userName) {
      userExists = true;
    }
  })
  return userExists;
}

function highscorepage() {
  highscorepagehtml();
  fillhighscorelist();
  findHighestScore();
}
function findHighestScore() {
  if (localStorage.getItem('highScores')) {
    let highScores = JSON.parse(localStorage.getItem('highScores'));
    highScores.sort((a, b) => (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0));
    document.getElementById('highestScorer').innerHTML = `${highScores[0].userName} - ${highScores[0].score}`
  } else {
    document.getElementById('statusMessage').innerHTML = 'No Scores yet, please play the game first!'
  }
}

function fillhighscorelist() {
  if (localStorage.getItem('highScores')) {
    let highScores = JSON.parse(localStorage.getItem('highScores'));
    generateHighScoresList(highScores);
  }
}
function generateHighScoresList(highScores) {
  const table = createElement('table', 'table table-bordered');
  const tr = createElement('tr');
  const tdUserName = createElement('td', 'font-weight-bold text-center');
  tdUserName.innerHTML = 'UserName';
  const tdUserScore = createElement('td', 'font-weight-bold text-center');
  tdUserScore.innerHTML = 'Score';
  tr.append(tdUserName, tdUserScore);
  table.append(tr);
  highScores.forEach(highScore => {
    const tr = createElement('tr');
    const pUserName = createElement('td', 'text-center');
    pUserName.innerHTML = highScore.userName;
    const pScore = createElement('td', 'text-center');
    pScore.innerHTML = highScore.score;
    tr.append(pUserName, pScore);
    table.append(tr);
  })
  document.getElementById('highScoresList').append(table);
}

function goToPlayAgain() {
  window.location.replace("/gamepage.html");
}


function goToHome() {
  window.location.replace("/index.html");
}
function highscorepagehtml() {
  const containerH = createElement("div", "container mt-5");
  const row = createElement("div", "row");
  const col = createElement("div", "col-md-6 offset-md-3 endPage");

  const h2 = createElement('h2', 'pageTitle text-center');
  h2.innerHTML = 'Highest Score';
  const h3 = createElement('h3', 'text-center', 'highestScorer');


  const statusMessage = createElement('h5', 'text-center', 'statusMessage');

  const h4 = createElement('h4', 'pageTitle text-center mt-5');
  h4.innerHTML = 'High Scores';
  const highScoresList = createElement('div', '', 'highScoresList');

  const goHomeBtn = createElement('button', 'btn btn-info mt-2', 'goHome');
  goHomeBtn.addEventListener('click', goToHome);
  goHomeBtn.innerHTML = 'Go Home';

  col.append(h2, h3, h4, highScoresList, statusMessage, goHomeBtn);
  row.append(col);
  containerH.append(row);
  document.body.append(containerH);
}
