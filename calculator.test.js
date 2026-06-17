const test = require("node:test");
const assert = require("node:assert/strict");
const { createCalculator } = require("./calculator.js");

// Helper: ketik serangkaian digit
function type(calc, digits) {
  for (const d of String(digits)) {
    if (d === ".") calc.inputDecimal();
    else calc.inputNumber(d);
  }
}

test("kondisi awal menampilkan 0", () => {
  const calc = createCalculator();
  assert.equal(calc.getCurrent(), "0");
});

test("input angka mengganti 0 di awal", () => {
  const calc = createCalculator();
  type(calc, "42");
  assert.equal(calc.getCurrent(), "42");
});

test("penjumlahan: 2 + 3 = 5", () => {
  const calc = createCalculator();
  type(calc, "2");
  calc.chooseOperator("+");
  type(calc, "3");
  calc.equals();
  assert.equal(calc.getCurrent(), "5");
});

test("pengurangan: 10 - 4 = 6", () => {
  const calc = createCalculator();
  type(calc, "10");
  calc.chooseOperator("-");
  type(calc, "4");
  calc.equals();
  assert.equal(calc.getCurrent(), "6");
});

test("perkalian: 6 * 7 = 42", () => {
  const calc = createCalculator();
  type(calc, "6");
  calc.chooseOperator("*");
  type(calc, "7");
  calc.equals();
  assert.equal(calc.getCurrent(), "42");
});

test("pembagian: 20 / 5 = 4", () => {
  const calc = createCalculator();
  type(calc, "20");
  calc.chooseOperator("/");
  type(calc, "5");
  calc.equals();
  assert.equal(calc.getCurrent(), "4");
});

test("pembagian dengan nol menghasilkan Error", () => {
  const calc = createCalculator();
  type(calc, "8");
  calc.chooseOperator("/");
  type(calc, "0");
  calc.equals();
  assert.equal(calc.getCurrent(), "Error");
});

test("presisi floating point: 0.1 + 0.2 = 0.3", () => {
  const calc = createCalculator();
  type(calc, "0.1");
  calc.chooseOperator("+");
  type(calc, "0.2");
  calc.equals();
  assert.equal(calc.getCurrent(), "0.3");
});

test("operasi berantai: 2 + 3 * 4 = 20 (kiri ke kanan)", () => {
  const calc = createCalculator();
  type(calc, "2");
  calc.chooseOperator("+");
  type(calc, "3");
  calc.chooseOperator("*"); // hitung 2+3=5 dulu
  type(calc, "4");
  calc.equals(); // 5*4=20
  assert.equal(calc.getCurrent(), "20");
});

test("ganti operator sebelum input angka kedua", () => {
  const calc = createCalculator();
  type(calc, "9");
  calc.chooseOperator("+");
  calc.chooseOperator("-"); // ganti ke minus, tidak menghitung
  type(calc, "4");
  calc.equals();
  assert.equal(calc.getCurrent(), "5");
});

test("desimal: tidak boleh ada dua titik", () => {
  const calc = createCalculator();
  type(calc, "3");
  calc.inputDecimal();
  calc.inputDecimal();
  type(calc, "14");
  assert.equal(calc.getCurrent(), "3.14");
});

test("persen: 50% = 0.5", () => {
  const calc = createCalculator();
  type(calc, "50");
  calc.percent();
  assert.equal(calc.getCurrent(), "0.5");
});

test("hapus satu digit (backspace)", () => {
  const calc = createCalculator();
  type(calc, "123");
  calc.deleteLast();
  assert.equal(calc.getCurrent(), "12");
});

test("hapus sampai habis kembali ke 0", () => {
  const calc = createCalculator();
  type(calc, "7");
  calc.deleteLast();
  assert.equal(calc.getCurrent(), "0");
});

test("clearAll mereset semua state", () => {
  const calc = createCalculator();
  type(calc, "5");
  calc.chooseOperator("+");
  type(calc, "3");
  calc.clearAll();
  assert.equal(calc.getCurrent(), "0");
  assert.equal(calc.getOperator(), null);
  assert.equal(calc.getPrevious(), null);
});

test("input angka setelah Error otomatis reset", () => {
  const calc = createCalculator();
  type(calc, "5");
  calc.chooseOperator("/");
  type(calc, "0");
  calc.equals();
  assert.equal(calc.getCurrent(), "Error");
  calc.inputNumber("7");
  assert.equal(calc.getCurrent(), "7");
});

test("lanjut menghitung dari hasil sebelumnya", () => {
  const calc = createCalculator();
  type(calc, "10");
  calc.chooseOperator("+");
  type(calc, "5");
  calc.equals(); // 15
  calc.chooseOperator("*");
  type(calc, "2");
  calc.equals(); // 30
  assert.equal(calc.getCurrent(), "30");
});
