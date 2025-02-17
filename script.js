const display = document.querySelector('#display');
const buttonsContainer = document.querySelector('.buttons');
const operators = ['+', '-', '*', '/'];

display.innerText = '0';
let errorState = false;

function updateDisplay(value) {

    if (errorState) {
        if (!operators.includes(value) && value !== '=' && value !== '%' && value !== ',' && value !== '*') {
            display.innerText = value;
            errorState = false;
            return;
        } else {
            return;
        }
    }

    if (value === 'x') return; 
    if (value === '*') value = '*'; 

    let lastChar = display.innerText.slice(-1);
    if (display.innerText === '0' && operators.includes(value)) return;
    if (operators.includes(value) && operators.includes(lastChar)) return;

    if (value === ',') {
        value = '.';
        let lastNumber = display.innerText.split(/[-+*/]/).pop();
        if (lastNumber === '' || lastNumber.includes('.') || errorState) return;
    }

    if (value === '%') {
        if (operators.includes(lastChar) || lastChar === '%' || errorState) return;
        display.innerText += '%';
        return;
    }

    if (display.innerText === '0' && value !== '.') {
        display.innerText = value;
    } else {
        display.innerText += value;
    }

}

function calculate() {

    try{
        let expression = display.innerText.replace(/,/g, ".")
                                          .replace(/(\d+(?:\.\d+)?)%/g, "($1 / 100)");
        let lastChar = expression.slice(-1);

        if (expression === '0' || operators.includes(lastChar)) return;
        if (/\/0(?![.\d])/.test(expression)) {
            display.innerText = "Tidak dapat dibagi 0";
            errorState = true;
            return;
        }

        let result = parseFloat(new Function(`return ${expression}`)());
        display.innerText = Number(result.toFixed(10)).toString().replace(".",",");
    } catch(error) {
        display.innerText = "error";
        errorState = true;
    }

}

function clearDisplay() {

    display.innerText = "0";
    errorState = false;

}

function backspace() {

    if (errorState) {
        clearDisplay();
        return;
    }
    display.innerText = display.innerText.slice(0, -1) || '0';

}

buttonsContainer.addEventListener('click', function (event) {

    if (!event.target.matches("button")) return;
    let value = event.target.innerText;
    let id = event.target.id;

    if (id === "*") {
        value = '*';
    }

    switch (id) {
        case "clear":
            clearDisplay();
            break;
        case "backspace":
            backspace();
            break;
        case "equal":
            if (!errorState) calculate();
            break;
        default:
            updateDisplay(value);
            break;
    }

});
