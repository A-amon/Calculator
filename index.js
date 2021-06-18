var themes
var prevSelected = null
var equation = "0"
var lastEqChar = ""
var doReset = false

window.onload = function () {
    themes = document.getElementsByClassName("calculator__theme")

    for (let i = 0; i < 3; i++) {
        let radio = themes[i].children[0]
        radio.addEventListener("change", event => { handleRadio(event) })
    }

    const buttons = document.getElementsByClassName("calculator__button")
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", event => { handleButton(event) })
    }

    initTheme()
}

function handleButton(event) {
    const value = event.target.getAttribute("data-value")

    switch (value) {
        case "reset":
            reset()
            break
        case "delete":
            deleteBack()
            break
        case "=":
            calculate()
            break
        default:
            if (doReset)
                reset()
            addToDisplay(value)
    }
}

// delete one character at back
function deleteBack() {
    equation = equation.slice(0, -1)
    setDisplay(equation)
}

// reset display to 0
function reset() {
    equation = "0"
    setDisplay(0)
    doReset = false
}

// calculate final result
function calculate() {
    let { numbers, symbols } = splitNumbersSymbols()

    numbers = multiplyDivide(numbers, symbols)

    if (numbers.length > 1) {
        symbols = symbols.filter(symbol => symbol !== "x" && symbol !== "/")    //only contains + and -

        let result = 0
        for (let [ind, symbol] of symbols.entries()) {
            if (ind === 0)
                result = numbers[ind]
            if (symbol === "+") {
                result += numbers[ind + 1]
            }
            else {
                result -= numbers[ind + 1]
            }
        }
        setDisplay(result)
    }
    else {
        setDisplay(numbers[0])
    }
    doReset = true  //reset display when new input
}

//multiply and divide
function multiplyDivide(numbers, symbols) {
    let countOp = 0
    for (let [ind, symbol] of symbols.entries()) {
        if (symbol === "x" || symbol === "/") {
            let result = null
            let symbolInd = ind - countOp
            if (symbol === "x") {
                result = numbers[symbolInd] * numbers[symbolInd + 1]
            }
            else {
                result = numbers[symbolInd] / numbers[symbolInd + 1]
            }
            numbers[symbolInd] = result
            numbers.splice(symbolInd + 1, 1)
            countOp++
        }
    }

    return numbers  //numbers array after BODMAS multiply divide
}

//get numbers and symbols array separately
function splitNumbersSymbols() {
    let numbers = []
    let symbols = []
    let prevChar = ""

    const equationLength = equation.length

    for (let i = 0; i < equationLength; i++) {
        let char = equation[i]

        if (!isNumber(char) && char !== ".") {  //push numbers to array if operators
            numbers.push(parseFloat(prevChar))
            symbols.push(char)
            prevChar = ""
        }
        else
            prevChar += char
        if (i === equationLength - 1)   //push last number into numbers array
            numbers.push(parseInt(prevChar))
    }

    return { numbers, symbols }
}

//check if character is number
function isNumber(char) {
    return !Number.isNaN(parseFloat(char))  //inverse of is not number
}

//concatenate value to end of display
function addToDisplay(text) {
    if (!isNumber(lastEqChar) && !isNumber(text))    //dont include symbol if prev input is symbol
        return
    lastEqChar = text

    if (equation === "0")   //replace 0 with input on first input
        equation = ""
    equation += text
    setDisplay(equation)
}

//set displayed text
function setDisplay(text) {
    let displayText = document.getElementsByClassName("display__text")[0]
    displayText.textContent = text
}

function handleRadio(event) {
    let selectedRadio = event.target
    let selectedTheme = selectedRadio.getAttribute("data-theme")

    setTheme(selectedTheme)
}

function setTheme(theme) {
    document.body.setAttribute("data-theme", theme);

    let selectedRadio = themes[theme - 1].children[0]

    if (prevSelected != null)
        prevSelected.checked = false    //uncheck previously checked radio

    prevSelected = selectedRadio
    prevSelected.checked = true
}

//initialize theme based on system preference
function initTheme() {
    //dark mode
    let defaultTheme = 3

    // light mode
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        defaultTheme = 2
    }

    setTheme(defaultTheme)
}