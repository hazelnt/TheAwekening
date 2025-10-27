// Global variables for game state
let level = 0;
let part = 0;
let knowledgePoints = 0;
let gameStarted = false;
let awaitingAnswer = false;
let typing = false;

// DOM elements
const output = document.getElementById("output");
const input = document.getElementById("userInput");

// Questions and correct answers for each level
const questions = {
  1: `To be an AI you have to know kinds of data,
because a good AI is one that is familiar with data.
I will tell you 5 of them:
1. int -> integer, whole numbers like 1, 2, 3, etc.
2. float -> decimal numbers like 1.5, 2.75, etc.
3. string -> text like "hello", "AI", etc.
4. boolean -> true or false
5. char -> single letters like 'a', 'b', 'c', etc.
what kind of data types is (from left to right): 2, true, intelligence, A, 3.14159
ans example: int, char, ..., data types5`,

  2: `Now that you know the basic data types,
you must learn to differentiate numeric from non-numeric data.
Numeric means it can be calculated or measured.
Which of these are numeric?
Choices: 25, "ChatGPT", 3.14, 'B', true
ans example: 25, B, true`,

  3: `AI also handles collections of data.
Some examples are:
- array -> ordered list like [1, 2, 3]
- object -> pair of key and value like {name: "AI", age: 2}
Which structure would you use to store student names: "Ali", "Budi", "Cici"?
ans template: array or object`,

4: `Arrays can also show relationships! 
Imagine:
let teachers = ["Mr. Smith", "Ms. Jane"];
let students = [["Ava", "Liam"], ["Noah", "Emma"]];
Here, each teacher has their own group of students —
like teachers[0] → students[0] means Mr. Smith teaches Ava and Liam.
if
let teachers= ["Mr. Stark"," Ms. Belova", "Mr. Roger" ]
let subject = ["Science", "History", "Math", "Art"] 
if teachers[0] → subject [3]
who is the teacher and what subject they teach?
ans example = Mr. Roger teach Science`,

  5: `Arrays can even store *different kinds of data* at once! 
Example:
let surveyData = [
  ["Alex", ["reading", "gaming"], true],
  ["Mia", ["music", "painting", "traveling"], false]
];

Here’s what each part means:
- surveyData[i][0] → name (text)
- surveyData[i][1] → hobbies (multiple choices)
- surveyData[i][2] → newsletter subscription (true/false)
From the example what data and what type of data is stored at SurveyData[1][1]
ans example = reading, gaming and int  `,

  6: `You are now entering the logic layer.
Booleans control logic.
If temperature > 30 => true, else false.
If temperature = 28, what will the AI output?
ans template: true / false`,

  7: `Let's test condition chaining.
If x = 10 and y = 5:
AI says "yes" only if x > 5 AND y < 10.
Will AI say yes?
ans template: yes / no`,

  8: `Now you meet data conversion.
It means changing data from one form to another.
Example:
- Number("5") → 5
- String(10) → "10"
Which of these is a number after conversion?
Choices: Number("7"), char("8"), String(9)
ans template: your answer`,

  9: `You are getting smarter!
Now let’s talk about *loops* — they repeat actions.
Example:
for (let i = 0; i < 3; i++) {
  console.log("Hi!");
}
This code repeats "Hi!" three times.
If i < 5, how many times will it repeat?
ans template: number`,

  10: `In AI logic, we need *conditions*.
Example:
if (score > 50) print("pass") else print("fail")
If score = 50, what happens?
ans template: pass / fail`,

  11: `Now you meet *function*.
It means a reusable block of code that performs a specific task.
Example:
- function greet() { return "Hello!"; }
- greet() → "Hello!"
Which of these calls the function correctly?
Choices: greet, greet(), return greet
`,

  12: `Now you meet function return.
It means the result that comes back when the function finishes.
Example:
- function add(a, b) { return a + b; }
- add(2, 3) → 5
what is the return of add(87+9)`,

  13: `Now you meet nested functions.
It means using a function inside another function.
Example:
- function double(x) { return x * 2; }
- function triple(x) { return x * 3; }
- double(triple(2)) → 12
Which of these shows a nested function call?
Choices: double(3), triple(2), double(triple(2))`,

  14: `Now you meet function with logic.
It means a function can decide what to do using conditions (like if statements).
Example:
- function check(age) {
    if (age >= 18) { return "Adult"; }
    else { return "Minor"; }
  }
- check(20) → "Adult"
Which of these will return "Minor"?
Choices: check(10), check(18), check(25)`,

  15: `Now you meet function with strings.
It means a function can also work with text data.
Example:
- function shout(name) { return name.toUpperCase(); }
- shout("luna") → "LUNA"
what function that have the output "AI IS COOL"
ans template = shout("string")`

};

const correctAnswers = {
  1: "int, boolean, string, char, float",
  2: "25, 3.14",
  3: "array",
  4: "Mr. Stark teach art",
  5: "music, painting, traveling and string",
  6: "false",
  7: "yes",
  8: "number('7')",
  9: "5",
  10: "fail",
  11: "greet()",
  12: "98",
  13: "double(triple(2))",
  14: "check(10)",
  15: 'shout("ai is cool")',
};

function printLine(text = "", delay = 25) {
  return new Promise((resolve) => {
    const lineDiv = document.createElement("div");
    const span = document.createElement("span");
    lineDiv.appendChild(span);
    output.appendChild(lineDiv);
    output.scrollTop = output.scrollHeight;

    typing = true;
    let i = 0;
    const interval = setInterval(() => {
      span.textContent = text.slice(0, i);
      i++;
      output.scrollTop = output.scrollHeight;

      if (i > text.length) {
        clearInterval(interval);
        typing = false;
        resolve();
      }
    }, delay);
  });
}

// Function to clear the output screen
function clearScreen() {
  output.innerHTML = "";
}

// Intro scene when the page loads
async function introScene() {
  await printLine("Initializing AI System...");
  await printLine("Loading neural network modules...");
  await printLine("Access Granted.");
  await printLine("");
  await printLine('Type "start" to begin.');
}

// Start the game
async function startGame() {
  gameStarted = true;
  level = 1;
  part = 1;
  knowledgePoints = 0;
  clearScreen();

  await printLine("AI Awakening: Discover How AI Works");
  await printLine("Embark on a 15-level journey. Enter answers in the box below when prompted.");
  await printLine("");
  await showStatus();
  await askQuestion();
}

// Display current game status
async function showStatus() {
  await printLine(`Part: ${part}`);
  await printLine(`Level: ${level}`);
  await printLine(`Knowledge Points: ${knowledgePoints}`);
  await printLine("");
}

// Ask the current question
async function askQuestion() {
  awaitingAnswer = true;
  await printLine(`Question for Level ${level}:`);
  const questionText = questions[level] || "No question available.";
  const lines = questionText.split("\n");
  for (const line of lines) {
    await printLine(line.trim());
  }
}

// Handle user answer
async function handleAnswer(answer) {
  if (!awaitingAnswer) return;
  awaitingAnswer = false;

  const correctAnswer = correctAnswers[level];
  const userAnswer = answer.toLowerCase().trim();
  const isCorrect = userAnswer.includes(correctAnswer.toLowerCase());

  if (isCorrect) {
    await printLine("Correct! Type 'next' to continue or 'exit' to quit.");
  } else {
    await printLine("Incorrect. Type 'retry' to try again or 'exit' to quit.");
  }
}

// Proceed to next level
async function nextLevel() {
  level++;
  knowledgePoints += 10;

  if (level > 15) {
    await endGame();
    return;
  }

  if ((level - 1) % 5 === 0 && level !== 1) {
    part = Math.floor((level - 1) / 5) + 1;
  }

  clearScreen();
  await printLine("Loading next challenge...");
  await printLine("");
  await showStatus();
  await askQuestion();
}

// Retry current level
async function retryLevel() {
  clearScreen();
  await printLine("> Retrying current level...");
  await printLine("");
  await showStatus();
  await askQuestion();
}

// End the game
async function endGame() {
  clearScreen();
  await printLine("Exiting AI System...");
  await printLine("");

  let message = "";
  if (level <= 5) message = "Good job, little soldier.";
  else if (level <= 10) message = "Now you are a master in the AI system.";
  else message = "Are you a hacker?";

  await printLine(message);
  await printLine("");
  await printLine("Simulation complete.");
  gameStarted = false;
}

// Event listener for user input
input.addEventListener("keydown", async function (e) {
  if (e.key === "Enter" && !typing) {
    const raw = input.value.trim();
    if (!raw) return;
    const command = raw.toLowerCase();

    await printLine("> " + raw);
    input.value = "";

    if (!gameStarted) {
      if (command === "start") await startGame();
      else await printLine('Invalid command. Type "start" to begin.');
      return;
    }

    if (awaitingAnswer) {
      await handleAnswer(command);
    } else {
      if (command === "next") await nextLevel();
      else if (command === "retry") await retryLevel();
      else if (command === "exit") await endGame();
      else await printLine("Unknown command.");
    }
  }
});

// Start intro automatically
introScene();
