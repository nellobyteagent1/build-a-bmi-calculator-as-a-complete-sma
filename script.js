(function () {
  'use strict';

  var currentUnit = 'metric';

  var form = document.getElementById('bmi-form');
  var weightInput = document.getElementById('weight');
  var heightInput = document.getElementById('height');
  var weightUnit = document.getElementById('weight-unit');
  var heightUnit = document.getElementById('height-unit');
  var weightError = document.getElementById('weight-error');
  var heightError = document.getElementById('height-error');
  var resultPanel = document.getElementById('result-panel');
  var bmiValueEl = document.getElementById('bmi-value');
  var bmiCategoryEl = document.getElementById('bmi-category');
  var bmiMarker = document.getElementById('bmi-marker');
  var resetBtn = document.getElementById('reset-btn');
  var unitBtns = document.querySelectorAll('.unit-btn');

  // Unit toggle
  unitBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var unit = btn.getAttribute('data-unit');
      if (unit === currentUnit) return;
      currentUnit = unit;
      unitBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      updateLabels();
      resetForm();
    });
  });

  function updateLabels() {
    if (currentUnit === 'metric') {
      weightUnit.textContent = '(kg)';
      heightUnit.textContent = '(cm)';
      weightInput.placeholder = 'e.g. 70';
      heightInput.placeholder = 'e.g. 175';
    } else {
      weightUnit.textContent = '(lbs)';
      heightUnit.textContent = '(inches)';
      weightInput.placeholder = 'e.g. 154';
      heightInput.placeholder = 'e.g. 69';
    }
  }

  // Validation
  function validateField(input, errorEl, label) {
    var val = input.value.trim();
    if (val === '') {
      errorEl.textContent = label + ' is required';
      input.classList.add('invalid');
      return NaN;
    }
    var num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
      errorEl.textContent = 'Enter a positive number';
      input.classList.add('invalid');
      return NaN;
    }
    errorEl.textContent = '';
    input.classList.remove('invalid');
    return num;
  }

  // BMI calculation
  function calculateBMI(weight, height) {
    if (currentUnit === 'metric') {
      var heightM = height / 100;
      return weight / (heightM * heightM);
    } else {
      return (weight / (height * height)) * 703;
    }
  }

  function getCategory(bmi) {
    if (bmi < 18.5) return { label: 'Underweight', cls: 'category-underweight' };
    if (bmi < 25)   return { label: 'Normal weight', cls: 'category-normal' };
    if (bmi < 30)   return { label: 'Overweight', cls: 'category-overweight' };
    return { label: 'Obese', cls: 'category-obese' };
  }

  function getMarkerPercent(bmi) {
    // Map BMI 10-40 to 0%-100%
    var pct = ((bmi - 10) / 30) * 100;
    return Math.max(0, Math.min(100, pct));
  }

  // Form submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var weight = validateField(weightInput, weightError, 'Weight');
    var height = validateField(heightInput, heightError, 'Height');
    if (isNaN(weight) || isNaN(height)) return;

    var bmi = calculateBMI(weight, height);
    var cat = getCategory(bmi);

    bmiValueEl.textContent = bmi.toFixed(1);
    bmiValueEl.className = 'bmi-value ' + cat.cls;
    bmiCategoryEl.textContent = cat.label;
    bmiCategoryEl.className = 'bmi-category ' + cat.cls;
    bmiMarker.style.left = getMarkerPercent(bmi) + '%';

    resultPanel.classList.remove('hidden');
  });

  // Reset
  function resetForm() {
    form.reset();
    weightInput.classList.remove('invalid');
    heightInput.classList.remove('invalid');
    weightError.textContent = '';
    heightError.textContent = '';
    resultPanel.classList.add('hidden');
  }

  resetBtn.addEventListener('click', resetForm);

  // Clear error on input
  weightInput.addEventListener('input', function () {
    weightInput.classList.remove('invalid');
    weightError.textContent = '';
  });
  heightInput.addEventListener('input', function () {
    heightInput.classList.remove('invalid');
    heightError.textContent = '';
  });
})();
