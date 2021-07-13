describe('calculator theme switching', () => {
    //  default theme to theme 2
    beforeEach(() => {
        document.body.setAttribute('data-theme', 2)
    })

    describe('composed', () => {
        describe('select radio button', () => {
            const radioButtons = document.querySelectorAll('[name="theme"]')

            it('select new theme', () => {
                //  select theme 3
                radioButtons[2].click()
                chai.assert.equal(document.body.getAttribute('data-theme'), '3')
            })

            it('select current theme', () => {
                //  select theme 2
                radioButtons[1].click()
                chai.assert.equal(document.body.getAttribute('data-theme'), '2')
            })
        })
    })

    describe('atomic', () => {
        it('set theme', () => {
            //  select theme 1
            setTheme(1)
            chai.assert.equal(document.body.getAttribute('data-theme'), '1')
        })
    })
})

describe('calculation', () => {
    const display = document.getElementsByClassName('display__text')[0]

    beforeEach(() => {
        display.textContent = equation
        equation = '1+1x'
    })

    describe('atomic', () => {
        it('set display value', () => {
            setDisplay(100)
            chai.assert.equal(display.textContent, '100')
        })

        describe('check if is number', () => {
            it('invalid string', () => {
                chai.assert.isTrue(isNumber('1x3'))
            })

            it('valid string', () => {
                chai.assert.isTrue(isNumber('20'))
            })
        })
    })

    describe('composed', () => {
        it('separate numbers and symbols', () => {
            const { numbers, symbols } = splitNumbersSymbols()
            const expectedNumbers = [1, 1]
            const expectedSymbols = ['+', 'x']

            chai.assert.isTrue(numbers.every((number, ind) => number === expectedNumbers[ind])
                && symbols.every((symbol, ind) => symbol === expectedSymbols[ind]))
        })

        describe('multiply and divide', () => {
            it('only multiply and divide', () => {
                equation = '3x2/6'
                const { numbers, symbols } = splitNumbersSymbols()
                const expectedNumbers = [1]
                chai.assert.isTrue(multiplyDivide(numbers, symbols).every((number, ind) => number === expectedNumbers[ind]))
            })

            it('with other operators', () => {
                equation = '1+3x2/6-2'
                const { numbers, symbols } = splitNumbersSymbols()
                const expectedNumbers = [1, 1, 2]
                chai.assert.isTrue(multiplyDivide(numbers, symbols).every((number, ind) => number === expectedNumbers[ind]))
            })
        })

        describe('non-calculation operations', () => {
            it('reset', () => {
                reset()
                chai.assert.equal(display.textContent, '0')
            })

            it('delete', () => {
                deleteBack()
                chai.assert.equal(display.textContent, '1+1')
            })
        })

        describe('add operator/number to display', () => {
            //  should be invalid
            //  cannot have trailing operator(s)
            it('add operator', () => {
                addToDisplay('+')
                chai.assert.equal(display.textContent, '1+1')
            })

            //  should be valid
            it('add number', () => {
                const numberToAdd = 20
                addToDisplay(numberToAdd)
                chai.assert.equal(display.textContent, `1+1x${numberToAdd}`)
            })
        })

        describe('calculate final result', () => {
            describe('one type of operator', () => {
                it('minus', () => {
                    equation = '1-5-3'
                    calculate()
                    chai.assert.equal(display.textContent, '-7')
                })

                it('add', () => {
                    equation = '1+5+3'
                    calculate()
                    chai.assert.equal(display.textContent, '9')
                })

                it('multiply', () => {
                    equation = '1x5x3'
                    calculate()
                    chai.assert.equal(display.textContent, '15')
                })

                it('divide', () => {
                    equation = '1/5/3'
                    calculate()
                    chai.assert.equal(display.textContent, 1 / 5 / 3)
                })
            })

            it('multiple operators', () => {
                equation = '1+5x3/6'
                calculate()
                chai.assert.equal(display.textContent, 1 + 5 * 3 / 6)
            })
        })
    })
})