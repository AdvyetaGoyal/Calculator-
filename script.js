(function() {
  const prevEl = document.getElementById('prevOperand');
  const currEl = document.getElementById('currentOperand');

  let current = '0';
  let previous = '';
  let operation = null; 

  function format(nStr) {
    if (nStr === '' || nStr === '-') return nStr || '0';
    const n = Number(nStr);
    if (!Number.isFinite(n)) return 'Error';

    const [i, d] = nStr.split('.');
    const iFmt = Number(i).toLocaleString(undefined);
    return d !== undefined ? `${iFmt}.${d}` : iFmt;
  }

  function updateDisplay() {
    prevEl.textContent = previous ? `${format(previous)} ${symbolFor(operation) || ''}`.trim() : '';
    currEl.textContent = format(current);
  }

  function symbolFor(op) {
    switch (op) {
      case 'add': return '+';
      case 'subtract': return '−';
      case 'multiply': return '×';
      case 'divide': return '÷';
      default: return '';
    }
  }

  function clearAll() {
    current = '0';
    previous = '';
    operation = null;
    updateDisplay();
  }

  function del() {
    if (current === 'Error') { clearAll(); return; }
    if (current.length <= 1 || (current.length === 2 && current.startsWith('-'))) {
      current = '0';
    } else {
      current = current.slice(0, -1);
    }
    updateDisplay();
  }

  function appendNumber(num) {
    if (current === 'Error') current = '0';
    if (current === '0' && num !== '.') current = '';
    if (num === '.' && current.includes('.')) return;
    current += num;
    if (current === '.') current = '0.';
    updateDisplay();
  }

  function chooseOperation(op) {
    if (current === 'Error') return;
    if (operation && previous !== '') {

      compute();
    }
    operation = op;
    previous = current;
    current = '0';
    updateDisplay();
  }

  function compute() {
    if (!operation || previous === '' || current === '') return;
    const a = Number(previous);
    const b = Number(current);
    let result;
    switch (operation) {
      case 'add': result = a + b; break;
      case 'subtract': result = a - b; break;
      case 'multiply': result = a * b; break;
      case 'divide':
        if (b === 0) { current = 'Error'; previous=''; operation=null; updateDisplay(); return; }
        result = a / b; break;
      default: return;
    }
    current = String(result);
    previous = '';
    operation = null;
    updateDisplay();
  }

  function toggleSign() {
    if (current === 'Error') return;
    if (current.startsWith('-')) current = current.slice(1);
    else if (current !== '0') current = '-' + current;
    updateDisplay();
  }

  function percent() {
    if (current === 'Error') return;
    const n = Number(current);
    current = String(n / 100);
    updateDisplay();
  }


  document.querySelectorAll('.key').forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.getAttribute('data-number');
      const dec = btn.getAttribute('data-decimal');
      const op = btn.getAttribute('data-operation');
      const action = btn.getAttribute('data-action');

      if (num !== null) return appendNumber(num);
      if (dec !== null) return appendNumber('.');
      if (op) {
        if (op === 'percent') return percent();
        if (op === 'add') return chooseOperation('add');
        if (op === 'subtract') return chooseOperation('subtract');
        if (op === 'multiply') return chooseOperation('multiply');
        if (op === 'divide') return chooseOperation('divide');
      }
      if (action === 'clear') return clearAll();
      if (action === 'delete') return del();
      if (action === 'equals') return compute();
      if (action === 'toggle-sign') return toggleSign();
    });
  });


  window.addEventListener('keydown', (e) => {
    const k = e.key;
    if ((k >= '0' && k <= '9')) return appendNumber(k);
    if (k === '.') return appendNumber('.');
    if (k === '+') return chooseOperation('add');
    if (k === '-') return chooseOperation('subtract');
    if (k === '*') return chooseOperation('multiply');
    if (k === '/') return chooseOperation('divide');
    if (k === '%') return percent();
    if (k === 'Enter' || k === '=') return compute();
    if (k === 'Backspace') return del();
    if (k === 'Delete' || k === 'Escape') return clearAll();
  });


  updateDisplay();
})();