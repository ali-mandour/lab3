const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let currentInput = "0";   // the number being typed
let previousInput = null; // the number stored before an operator
let operator = null;      // the pending operator: +, -, *, /
let resetNext = false;    // true when the next digit should start a new number

function updateDisplay() {
  display.textContent = currentInput;
}

function inputDigit(digit) {
  if (resetNext) {
    currentInput = digit;
    resetNext = false;
  } else if (currentInput === "0") {
    currentInput = digit;
  } else {
    currentInput += digit;
  }
}

function inputDecimal() {
  if (resetNext) {
    currentInput = "0.";
    resetNext = false;
    return;
  }
  if (!currentInput.includes(".")) {
    currentInput += ".";
  }
}

function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? "Error" : a / b;
  }
}

function formatResult(value) {
  if (value === "Error") return value;
  // Avoid long floating-point tails such as 0.30000000000000004
  return String(parseFloat(value.toFixed(10)));
}

function handleOperator(nextOp) {
  if (operator && !resetNext) {
    const result = calculate(previousInput, currentInput, operator);
    currentInput = formatResult(result);
    previousInput = currentInput;
  } else {
    previousInput = currentInput;
  }
  operator = nextOp;
  resetNext = true;
  highlightOperator(nextOp);
}

function handleEquals() {
  if (operator === null) return;
  const result = calculate(previousInput, currentInput, operator);
  currentInput = formatResult(result);
  previousInput = null;
  operator = null;
  resetNext = true;
  highlightOperator(null);
}

function clearAll() {
  currentInput = "0";
  previousInput = null;
  operator = null;
  resetNext = false;
  highlightOperator(null);
}

function toggleSign() {
  if (currentInput === "0" || currentInput === "Error") return;
  currentInput = currentInput.startsWith("-")
    ? currentInput.slice(1)
    : "-" + currentInput;
}

function percent() {
  currentInput = formatResult(parseFloat(currentInput) / 100);
}

function highlightOperator(op) {
  document.querySelectorAll(".btn.operator").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.value === op);
  });
}


buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "clear") {
      clearAll();
    } else if (action === "sign") {
      toggleSign();
    } else if (action === "percent") {
      percent();
    } else if (action === "op") {
      handleOperator(button.dataset.value);
    } else if (action === "equals") {
      handleEquals();
    } else if (value === ".") {
      inputDecimal();
    } else if (value !== undefined) {
      inputDigit(value);
    }

    updateDisplay();
  });
});