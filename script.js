const display = document.querySelector('.display-input');  // The main display input
const historyDisplay = document.querySelector('.history-value');  // The history display

let displayValue = '';       // Holds the current input value
let firstOperand = null;     // Stores the first operand for calculation
let secondOperand = null;    // Stores the second operand (temporarily)
let currentOperator = null;  // Holds the current operator
let shouldResetDisplay = false; // Reset display for new input after calculation

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function modulo(a, b) {
  return a % b;
}

function operate(operator, a, b) {
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    case '%':
      return modulo(a, b);
    default:
      return null;
  }
}

function updateHistory(value) {
  historyDisplay.textContent += value;  // Append to the history display
}

function allClear() {
  displayValue = '';
  firstOperand = null;
  secondOperand = null;
  currentOperator = null;
  shouldResetDisplay = false;
  display.value = '0';  // Reset the display
  historyDisplay.textContent = '';  // Clear the history
}

function deleteLast() {
  displayValue = displayValue.slice(0, -1) || '0'; // Remove last character
  display.value = displayValue;
  historyDisplay.textContent = historyDisplay.textContent.slice(0, -1); // Remove last character from history
}

function append(value) {
  // Reset the display for new input after an operator or result
  if (shouldResetDisplay) {
    displayValue = '';  
    shouldResetDisplay = false;
  }

  // Prevent multiple decimals in a single number
  if (value === '.' && displayValue.includes('.')) return;

  if (displayValue === '0' && value !== '.') {
    displayValue = value;  // Replace the initial zero if entering a non-decimal number
  } else {
    displayValue += value; // Append the new value
  }

  display.value = displayValue;
  updateHistory(value);  // Update history as you append values
}

function setOperator(operator) {
  if (firstOperand === null) {
    firstOperand = parseFloat(displayValue);
  } else if (currentOperator) {
    // If an operator exists, evaluate the expression first
    secondOperand = parseFloat(displayValue);
    firstOperand = operate(currentOperator, firstOperand, secondOperand);
    display.value = firstOperand;
    updateHistory(' = ' + firstOperand); // Display the result in history
  }

  displayValue = '';
  currentOperator = operator;
  updateHistory(' ' + operator + ' ');  // Add operator to the history
  shouldResetDisplay = true;  // Reset display on next number append
}

function calculate() {
  if (!currentOperator || firstOperand === null) return;  // No calculation if missing operator or operands

  secondOperand = parseFloat(displayValue);

  const result = operate(currentOperator, firstOperand, secondOperand);
  if (result !== null) {
    display.value = result;
    updateHistory(' = ' + result);  // Show the result in the history

    firstOperand = result; // Use result as first operand for further calculations
    currentOperator = null;  // Reset operator
    shouldResetDisplay = true;  // Reset display for new input
    displayValue = ''; // Reset display value to allow for new input
  }
}

// Listen for keydown events
document.addEventListener('keydown', handleKeydown);

function handleKeydown(event) {
  const key = event.key; // Get the key pressed

  if (isNumberKey(key)) {
    append(key);  // If a number is pressed, append it
  } else if (isOperatorKey(key)) {
    setOperator(convertOperator(key));  // Handle operator keys
  } else if (key === 'Enter' || key === '=') {
    event.preventDefault();  // Prevent form submission (if any)
    calculate();  // Trigger calculation on Enter or '=' key
  } else if (key === 'Backspace') {
    deleteLast();  // Trigger delete on Backspace
  } else if (key === 'Escape' || key.toLowerCase() === 'c') {
    allClear();  // Clear everything on 'Escape' or 'C' key
  } else if (key === '.') {
    append('.');  // Append decimal point
  }
}

// Helper function to check if the key is a number
function isNumberKey(key) {
  return !isNaN(key) && key !== ' ';  // Ensure the key is a valid number
}

// Helper function to check if the key is an operator
function isOperatorKey(key) {
  return ['+', '-', '*', '/', '%'].includes(key);
}

// Helper function to convert keyboard operator to the corresponding display operator
function convertOperator(key) {
  return key === '*' ? '*' : key;  // Direct mapping for other operators, but convert '*' for multiplication
}
