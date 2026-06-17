(function () {
  "use strict";

  const resultEl = document.getElementById("result");
  const historyEl = document.getElementById("history");

  const OP_SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  const calc = window.CalculatorCore.createCalculator();

  function formatNumber(value) {
    if (value === "" || value === "-" || value === "Error") return value || "0";
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
    resultEl.textContent = formatNumber(calc.getCurrent());
    const op = calc.getOperator();
    const prev = calc.getPrevious();
    if (op && prev !== null) {
      historyEl.textContent = formatNumber(prev) + " " + OP_SYMBOLS[op];
    } else {
      historyEl.textContent = "";
    }
  }

  function handleAction(action) {
    switch (action) {
      case "clear": calc.clearAll(); break;
      case "delete": calc.deleteLast(); break;
      case "percent": calc.percent(); break;
      case "decimal": calc.inputDecimal(); break;
      case "equals": calc.equals(); break;
    }
    updateDisplay();
  }

  // Event delegation untuk klik tombol
  document.querySelector(".keys").addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.num !== undefined) {
      calc.inputNumber(btn.dataset.num);
      updateDisplay();
    } else if (btn.dataset.op !== undefined) {
      calc.chooseOperator(btn.dataset.op);
      updateDisplay();
    } else if (btn.dataset.action !== undefined) {
      handleAction(btn.dataset.action);
    }
  });

  // Dukungan keyboard
  document.addEventListener("keydown", function (e) {
    const key = e.key;
    if (key >= "0" && key <= "9") {
      calc.inputNumber(key);
      updateDisplay();
    } else if (key === ".") {
      calc.inputDecimal();
      updateDisplay();
    } else if (["+", "-", "*", "/"].includes(key)) {
      calc.chooseOperator(key);
      updateDisplay();
    } else if (key === "Enter" || key === "=") {
      e.preventDefault();
      calc.equals();
      updateDisplay();
    } else if (key === "Backspace") {
      calc.deleteLast();
      updateDisplay();
    } else if (key === "Escape") {
      calc.clearAll();
      updateDisplay();
    } else if (key === "%") {
      calc.percent();
      updateDisplay();
    }
  });

  updateDisplay();
})();
