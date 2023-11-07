const targetInput = document.getElementById("targetInput");
const foodNameInput = document.getElementById("foodName");
const caloriesInput = document.getElementById("calories");
const addButton = document.getElementById("addButton");
const foodItemsList = document.getElementById("foodItems");
const totalCalories = document.getElementById("totalCalories");
const chartCanvas = document.getElementById("caloriesChart");
const ctx = chartCanvas.getContext("2d");
const sortButton = document.getElementById("sortButton");
const warningMessage = document.getElementById("warning");
const filterInput = document.getElementById("filter");
const clearAllButton = document.getElementById("clearAllButton");

// Цвета для продуктов
const colors = [
  "#3498db",
  "#e74c3c",
  "#2ecc71",
  "#f1c40f",
  "#da8eff",
  "#ff0000",
  "#1abc9c",
  "#2207d0",
  "#fffc00",
  "#22ff00",
  "#a100ff",
  "#560485",
  "#015749",
];

// Флаг для сортировки
let sortAsc = true

// Инициализация массива для хранения данных продуктов
let foodData = JSON.parse(localStorage.getItem("foodData")) || [];
let targetCalories = localStorage.getItem("targetCalories") || 2000;

// Обновление целевых калорий
targetInput.value = targetCalories;

// Функция для отображения продуктов в списке
function displayFoodItems(data) {
  foodItemsList.innerHTML = "";
  data.forEach((food, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `${index + 1}. ${food.name} - ${food.calories} калорий <button class="delete-button" data-index="${index}">Удалить</button>`;
    listItem.style.color = colors[index]
    foodItemsList.appendChild(listItem);
  });
  calculateTotalCalories();
}

// Функция для подсчета и отображения общего количества калорий
function calculateTotalCalories() {
  const total = foodData.reduce((acc, food) => acc + food.calories, 0);
  totalCalories.textContent = `${total} калорий`;
  checkCalorieLimit(total);
}

// Функция для проверки превышения целевых калорий
function checkCalorieLimit(totalCalories) {
  if (totalCalories > targetCalories) {
    warningMessage.textContent = "Превышение целевых калорий!";
  } else {
    warningMessage.textContent = "";
  }
}

// Для добавления продукта
addButton.addEventListener("click", () => {
  const name = foodNameInput.value;
  const calories = parseInt(caloriesInput.value);
  if (name && calories) {
    foodData.push({ name, calories });
    localStorage.setItem("foodData", JSON.stringify(foodData));
    foodNameInput.value = "";
    caloriesInput.value = "";
    displayFoodItems(foodData);
  }

  drawCaloriesChart();
});

// Событие для удаления продукта
foodItemsList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    const index = event.target.getAttribute("data-index");
    foodData.splice(index, 1);
    localStorage.setItem("foodData", JSON.stringify(foodData));
    displayFoodItems(foodData);
  }

  drawCaloriesChart();
});

// Событие для фильтрации продуктов
filterInput.addEventListener("input", () => {
  const filterText = filterInput.value.toLowerCase();
  console.log(filterText)
  const filteredItems = foodData.filter((food) =>
    food.name.toLowerCase().includes(filterText)
  );

  displayFoodItems(filteredItems);
});

// Для очистки всех данных
clearAllButton.addEventListener("click", () => {
  foodData = [];
  localStorage.removeItem("foodData");
  displayFoodItems(foodData);
  drawCaloriesChart();
});

// Для обновления целевых калорий
targetInput.addEventListener("input", () => {
  targetCalories = targetInput.value;
  localStorage.setItem("targetCalories", targetCalories);
  calculateTotalCalories();
});


// Рисование диаграммы
function drawCaloriesChart() {
  const totalCalories = foodData.reduce((acc, food) => acc + food.calories, 0);

  // Очистка холста
  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

  // Рисование графика
  // Ширина столбца
  const barWidth = 30;
  // Масштабный коэффициент
  const scaleFactor = chartCanvas.height / targetCalories;

  foodData.forEach((food, index) => {
    const x = index * (barWidth + 10);
    ctx.fillStyle = colors[index];
    const barHeight = food.calories * scaleFactor;
    ctx.fillRect(x, chartCanvas.height - barHeight, barWidth, barHeight);
  });

  // Отображение общего количество потребленных калорий
  totalCalories.textContent = `${totalCalories} калорий`;

  // Проверка и отображение предупреждения о превышении целевых калорий
  checkCalorieLimit(totalCalories);
}

// Сортировка товара по калориям
function sortFoodByCalories() {
  if(sortAsc) {
    foodData.sort((a, b) => a.calories - b.calories);
  } else {
    foodData.sort((a, b) => b.calories - a.calories);
  }
  sortAsc = !sortAsc
  localStorage.setItem("foodData", JSON.stringify(foodData));
  displayFoodItems(foodData);
}

// Для сортировки продуктов по калорийности
sortButton.addEventListener("click", () => {
  sortFoodByCalories();
  drawCaloriesChart();
});

// Вызов функции для рисования графика при загрузке страницы
drawCaloriesChart();

// Инициализация приложения
displayFoodItems(foodData);
