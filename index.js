var equation = '0'
var lastEqChar = ''
var doReset = false

//  click event handler
function handleButton (event) {
    const value = event.target.getAttribute('data-value')

    switch (value) {
        case 'reset':
            reset()
            break
        case 'delete':
            deleteBack()
            break
        case '=':
            calculate()
            break
        default:
            if (doReset)    //  reset calculator's display if doReset=true
                reset()
            addToDisplay(value)
    }
}

// delete one character at back
function deleteBack () {
    equation = equation.slice(0, -1)
    setDisplay(equation)
}

// reset display to 0
function reset () {
    equation = '0'
    setDisplay(0)
    doReset = false
}

// calculate final result
function calculate () {
    let { numbers, symbols } = splitNumbersSymbols()

    numbers = multiplyDivide(numbers, symbols)

    //  calculate if at least 2 numbers in equation
    if (numbers.length > 1) {
        symbols = symbols.filter(symbol => symbol !== 'x' && symbol !== '/')    //  only contains + and -

        let result = 0
        for (let [ind, symbol] of symbols.entries()) {
            if (ind === 0)
                result = numbers[ind]   //  initialize result with first number in equation
            if (symbol === '+') {       //  add operation
                result += numbers[ind + 1]
            }
            else {                      //  subtract operation
                result -= numbers[ind + 1]
            }
        }
        setDisplay(result)
    }
    else {
        setDisplay(numbers[0])
    }
    doReset = true  //  reset display when new input
}

//  multiply and divide
function multiplyDivide (numbers, symbols) {
    let countOp = 0
    for (let [ind, symbol] of symbols.entries()) {
        if (symbol === 'x' || symbol === '/') {
            let result = null
            let symbolInd = ind - countOp
            if (symbol === 'x') {           //  multiply operation
                result = numbers[symbolInd] * numbers[symbolInd + 1]
            }
            else {                          //  divide operation
                result = numbers[symbolInd] / numbers[symbolInd + 1]
            }
            numbers[symbolInd] = result
            numbers.splice(symbolInd + 1, 1)    //  remove operator after calculation/ usage
            countOp++
        }
    }

    return numbers  //  numbers array after BODMAS multiply divide
}

//  get numbers and symbols array separately
function splitNumbersSymbols () {
    let numbers = []
    let symbols = []
    let prevChar = ''

    const equationLength = equation.length

    for (let i = 0; i < equationLength; i++) {
        let char = equation[i]

        if (!isNumber(char) && char !== '.') {  //  push numbers to array if operators
            numbers.push(parseFloat(prevChar))
            symbols.push(char)
            prevChar = ''
        }
        else
            prevChar += char
        if (i === equationLength - 1 && isNumber(prevChar))   //  push last number into numbers array if is a number
            numbers.push(parseInt(prevChar))
    }

    return { numbers, symbols }
}

//  check if character is number
function isNumber (char) {
    return !Number.isNaN(parseFloat(char))  //  inverse of is not number
}

//  concatenate value to end of display
function addToDisplay (text) {
    if (!isNumber(lastEqChar) && !isNumber(text))    // dont include symbol if prev input is symbol
        return
    lastEqChar = text

    if (equation === '0')   //  replace 0 with input on first input
        equation = ''
    equation += text
    setDisplay(equation)
}

//  set displayed text
function setDisplay (text) {
    let displayText = document.getElementsByClassName('display__text')[0]
    displayText.textContent = text
}

//  update theme
function setTheme (theme) {
    const selectedRadio = document.querySelector(`[data-theme='${theme}']`)

    document.body.setAttribute('data-theme', theme);
    selectedRadio.checked = true
}

//  initialize theme based on system preference
function initTheme () {
    //  dark mode
    let defaultTheme = 3

    // light mode
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        defaultTheme = 2
    }

    setTheme(defaultTheme)
}

const themes = document.getElementsByClassName('calculator__theme')

//  assign event listener to radio buttons/ theme switchers
for (let i = 0; i < 3; i++) {
    let radio = themes[i].children[0]
    radio.addEventListener('change', event => {
        setTheme(event.target.getAttribute('data-theme'))
    })
}

//  assign event listener to buttons
const buttons = document.getElementsByClassName('calculator__button')
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', event => { handleButton(event) })
}

initTheme()