// Logika kalkulator murni (tanpa DOM) agar mudah di-test.
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.CalculatorCore = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function createCalculator() {
    const state = {
      current: "0", // angka yang sedang diketik
      previous: null, // operand sebelumnya
      operator: null, // operator yang dipilih
      overwrite: false, // true = ketikan berikutnya menimpa display
    };

    function inputNumber(digit) {
      if (state.current === "Error") clearAll();
      if (state.overwrite) {
        state.current = digit;
        state.overwrite = false;
      } else {
        state.current = state.current === "0" ? digit : state.current + digit;
      }
    }

    function inputDecimal() {
      if (state.overwrite) {
        state.current = "0.";
        state.overwrite = false;
      } else if (!state.current.includes(".")) {
        state.current += ".";
      }
    }

    function chooseOperator(op) {
      if (state.current === "Error") return;
      if (state.operator && !state.overwrite) {
        compute();
      }
      state.previous = state.current;
      state.operator = op;
      state.overwrite = true;
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
    }

    function clearAll() {
      state.current = "0";
      state.previous = null;
      state.operator = null;
      state.overwrite = false;
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
    }

    function percent() {
      if (state.current === "Error") return;
      state.current = String(Number(state.current) / 100);
    }

    return {
      state,
      inputNumber,
      inputDecimal,
      chooseOperator,
      compute,
      equals,
      clearAll,
      deleteLast,
      percent,
      getCurrent: () => state.current,
      getOperator: () => state.operator,
      getPrevious: () => state.previous,
    };
  }

  return { createCalculator };
});
