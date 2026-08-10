// Global calculator keyboard bridge.
// This intentionally lives outside the React component so physical keyboard
// and numpad input keep working even when focus is elsewhere in the app.
const keyMap = {
  Enter: '=',
  NumpadEnter: '=',
  Equal: '=',
  NumpadAdd: '+',
  NumpadSubtract: '-',
  NumpadMultiply: '×',
  NumpadDivide: '÷',
  NumpadDecimal: '.',
  Decimal: '.',
  Backspace: '⌫',
  Delete: 'C',
  Escape: null,
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷',
  '%': '%',
  '.': '.',
};

function calculatorIsOpen() {
  const el = document.querySelector('.calculator-backdrop .calculator');
  if (!el) return null;
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden';
}

function getButton(calculator, label) {
  return [...calculator.querySelectorAll('.calc-keys button')]
    .find(button => button.textContent.trim() === label);
}

window.addEventListener('keydown', event => {
  const calculator = calculatorIsOpen();
  if (!calculator) return;

  let label = keyMap[event.code] ?? keyMap[event.key];
  if (/^Numpad[0-9]$/.test(event.code)) label = event.code.slice(-1);
  if (/^[0-9]$/.test(event.key)) label = event.key;

  // Let the calculator's existing Escape handler close the modal.
  if (event.key === 'Escape' || event.code === 'Escape') return;
  if (label == null) return;

  const button = getButton(calculator, label);
  if (!button) return;

  event.preventDefault();
  event.stopPropagation();
  button.click();
});
