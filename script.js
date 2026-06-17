(function () {
  "use strict";

  const resultEl = document.getElementById("result");
  const historyEl = document.getElementById("history");

  const OP_SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  const state = {
    current: "0",   // angka yang sedang diketik
    previous: null, // operand sebelumnya
    operator: null, // operator yang dipilih
    overwrite: false, // true = ketikan berikutnya menimpa display
  };

  function formatNumber(value) {
    if (value === "" || value === "-") return value;
    const num = Number(value);
    if (!isFinite(num)) return "Error";
    // Pertahankan input mentah jika sedang mengetik desimal
    if (value.includes(".") || value.endsWith(".")) {
      const [intPart, decPart] = value.split(".");
      return Number(intPart).toLocaleString("en-US") + "." + (decPart ?? "");
    }
    return num.toLocaleString("en-US");
  }

  function updateDisplay() {
    resultEl.textContent = formatNumber(state.current);
    if (state.operator && state.previous !== null) {
      historyEl.textContent =
        formatNumber(state.previous) + " " + OP_SYMBOLS[state.operator];
    } else {
      historyEl.textContent = "";
    }
  }

  function inputNumber(digit) {
    if (state.overwrite) {
      state.current = digit;
      state.overwrite = false;
    } else {
      state.current = state.current === "0" ? digit : state.current + digit;
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (state.overwrite) {
      state.current = "0.";
      state.overwrite = false;
    } else if (!state.current.includes(".")) {
      state.current += ".";
    }
    updateDisplay();
  }

  function chooseOperator(op) {
    if (state.operator && !state.overwrite) {
      compute();
    }
    state.previous = state.current;
    state.operator = op;
    state.overwrite = true;
    updateDisplay();
  }

  function compute() {
    if (state.operator === null || state.previous === null) return;
    const a = Number(state.previous);
    const b = Number(state.current);
    let res;
    switch (state.operator) {
      case "+": res = a + b; break;
      case "-": res = a - b; break;
      case "*": res = a * b; break;
      case "/": res = b === 0 ? NaN : a / b; break;
      default: return;
    }
    if (!isFinite(res)) {
      state.current = "Error";
    } else {
      // Batasi presisi floating point
      state.current = String(Math.round(res * 1e10) / 1e10);
    }
    state.previous = null;
    state.operator = null;
    state.overwrite = true;
  }

  function equals() {
    compute();
    historyEl.textContent = "";
    resultEl.textContent = formatNumber(state.current);
  }

  function clearAll() {
    state.current = "0";
    state.previous = null;
    state.operator = null;
    state.overwrite = false;
    updateDisplay();
  }

  function deleteLast() {
    if (state.overwrite || state.current === "Error") {
      state.current = "0";
      state.overwrite = false;
    } else if (state.current.length <= 1) {
      state.current = "0";
    } else {
      state.current = state.current.slice(0, -1);
    }
    updateDisplay();
  }

  function percent() {
    state.current = String(Number(state.current) / 100);
    updateDisplay();
  }

  function handleAction(action) {
    switch (action) {
      case "clear": clearAll(); break;
      case "delete": deleteLast(); break;
      case "percent": percent(); break;
      case "decimal": inputDecimal(); break;
      case "equals": equals(); break;
    }
  }

  // Event delegation untuk klik tombol
  document.querySelector(".keys").addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.num !== undefined) {
      if (state.current === "Error") clearAll();
      inputNumber(btn.dataset.num);
    } else if (btn.dataset.op !== undefined) {
      if (state.current === "Error") return;
      chooseOperator(btn.dataset.op);
    } else if (btn.dataset.action !== undefined) {
      handleAction(btn.dataset.action);
    }
  });

  // Dukungan keyboard
  document.addEventListener("keydown", function (e) {
    const key = e.key;
    if (key >= "0" && key <= "9") {
      if (state.current === "Error") clearAll();
      inputNumber(key);
    } else if (key === ".") {
      inputDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
      if (state.current !== "Error") chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
      e.preventDefault();
      equals();
    } else if (key === "Backspace") {
      deleteLast();
    } else if (key === "Escape") {
      clearAll();
    } else if (key === "%") {
      percent();
    }
  });

  // Ekspor untuk keperluan testing
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { state, chooseOperator, compute, inputNumber, equals };
  }

  updateDisplay();
})();
