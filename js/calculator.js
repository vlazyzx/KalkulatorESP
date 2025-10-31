class Calculator {
            constructor() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operator = null;
                this.shouldResetScreen = false;
                this.updateDisplay();
            }

            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operator = null;
                this.shouldResetScreen = false;
                this.updateDisplay();
                this.addTypingEffect();
            }

            delete() {
                if (this.currentOperand === '0') return;
                
                if (this.currentOperand.length === 1) {
                    this.currentOperand = '0';
                } else {
                    this.currentOperand = this.currentOperand.slice(0, -1);
                }
                
                this.updateDisplay();
                this.addTypingEffect();
            }

            appendNumber(number) {
                // Handle decimal point
                if (number === '.' && this.currentOperand.includes('.')) return;
                
                // Reset if needed
                if (this.shouldResetScreen || this.currentOperand === '0') {
                    this.currentOperand = '';
                    this.shouldResetScreen = false;
                }
                
                // Limit length
                if (this.currentOperand.length >= 15) return;
                
                this.currentOperand += number;
                this.updateDisplay();
                this.addTypingEffect();
            }

            appendOperator(operator) {
                if (this.operator !== null && !this.shouldResetScreen) {
                    this.calculate();
                }
                
                this.operator = operator;
                this.previousOperand = this.currentOperand;
                this.shouldResetScreen = true;
                this.updateDisplay();
            }

            calculate() {
                if (this.operator === null || this.previousOperand === '') return;
                
                let result;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                
                if (isNaN(prev) || isNaN(current)) return;
                
                switch (this.operator) {
                    case '+':
                        result = prev + current;
                        break;
                    case '-':
                        result = prev - current;
                        break;
                    case '×':
                        result = prev * current;
                        break;
                    case '÷':
                        if (current === 0) {
                            this.currentOperand = 'Error';
                            this.previousOperand = '';
                            this.operator = null;
                            this.shouldResetScreen = true;
                            this.updateDisplay();
                            return;
                        }
                        result = prev / current;
                        break;
                    default:
                        return;
                }
                
                // Format result
                this.currentOperand = this.formatNumber(result);
                this.operator = null;
                this.previousOperand = '';
                this.shouldResetScreen = true;
                this.updateDisplay();
                this.addTypingEffect();
            }

            formatNumber(number) {
                // Handle very large or very small numbers
                if (Math.abs(number) > 999999999999999) {
                    return number.toExponential(6);
                }
                
                // Round to avoid floating point issues
                const rounded = Math.round(number * 100000000) / 100000000;
                
                // Convert to string and limit decimal places
                let str = rounded.toString();
                
                // Limit total length
                if (str.length > 15) {
                    if (str.includes('.')) {
                        const parts = str.split('.');
                        const decimalsToKeep = Math.max(0, 15 - parts[0].length - 1);
                        str = rounded.toFixed(decimalsToKeep);
                    } else {
                        str = rounded.toExponential(6);
                    }
                }
                
                return str;
            }

            updateDisplay() {
                const currentDisplay = document.getElementById('current-operand');
                const previousDisplay = document.getElementById('previous-operand');
                
                currentDisplay.textContent = this.currentOperand;
                
                if (this.operator !== null) {
                    previousDisplay.textContent = `${this.previousOperand} ${this.operator}`;
                } else {
                    previousDisplay.textContent = '';
                }
            }

            addTypingEffect() {
                const currentDisplay = document.getElementById('current-operand');
                currentDisplay.classList.remove('typing-effect');
                void currentDisplay.offsetWidth; // Trigger reflow
                currentDisplay.classList.add('typing-effect');
            }
        }

        // Initialize calculator
        const calculator = new Calculator();

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') calculator.appendNumber(e.key);
            if (e.key === '.') calculator.appendNumber('.');
            if (e.key === '=' || e.key === 'Enter') calculator.calculate();
            if (e.key === 'Backspace') calculator.delete();
            if (e.key === 'Escape') calculator.clear();
            if (e.key === '+') calculator.appendOperator('+');
            if (e.key === '-') calculator.appendOperator('-');
            if (e.key === '*') calculator.appendOperator('×');
            if (e.key === '/') {
                e.preventDefault();
                calculator.appendOperator('÷');
            }
        });