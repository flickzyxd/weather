<script setup>
import {ref, computed} from 'vue'
import {debounce} from "lodash";
import pogodaLED from './assets/images/pogodaLED.jpg'
import pogodaSNEG from './assets/images/pogodaSNEG.jpg'
import pogodaVESNA from './assets/images/pogodaVESNA.jpg'
import pogodaLETO from './assets/images/pogodaLETO.jpg'
import pogodaPUSTINA from './assets/images/pogodaPUSTINA.jpeg'

const inputValue = ref('')
const API_KEY = '5a319f3fc0edf91ca28ae601bdce9115'
const someShit = ref(null)
const error = ref('')
const imageUrl = computed(() => {
  if (someShit.value !== null) {
    return imageTest(someShit.value.weather[0].icon)
  } else {
    return ''
  }
});
const backgroundStyle = computed(() => {
  if (!someShit.value) return {}

  const temp = someShit.value.main.temp
  let BgImg

  if (temp < -15) BgImg = pogodaLED
  else if (temp < -4) BgImg = pogodaSNEG
  else if (temp < 7) BgImg = pogodaVESNA
  else if (temp < 24) BgImg = pogodaLETO
  else if (temp >= 24) BgImg = pogodaPUSTINA

  return {
    backgroundImage: `url(${BgImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-image 0.5s ease'
  }
})

async function fetchWeather() {
  if (!inputValue.value.trim()) {
    error.value = 'Введите город';
    return;
  }

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue.value}&units=metric&lang=ru&appid=${API_KEY}`);
    if (!response.ok) throw new Error('Город не найден');
    someShit.value = await response.json();
    // imageUrl.value = imageTest(someShit.value.weather[0].icon)
  } catch (err) {
    error.value = err.message;
    console.log('ошибка', err);
  }
}

function imageTest(name) {
  try {
    return new URL(`./assets/images/${name}_t.png`, import.meta.url).href;
  } catch (err) {
    console.log('Ошибка загрузки изображения:', err);
  }
}


const debounced = debounce(fetchWeather, 500)
</script>

<template>
  <div class="testovichok weather-app" :style="backgroundStyle">
    <div class="input-container">
      <input v-model="inputValue" @input="debounced" placeholder="Введите название города" class="input-weather"/>
    </div>
    <div v-if='someShit?.main' class="weather-main">
      <p> {{ someShit.name }}</p>
      <p>Температура: {{ someShit.main.temp }}°C</p>
      <p>Ощущается как: {{ someShit.main.feels_like }}°C</p>
      <img class="centerImage" :src="imageUrl" alt="Dynamic Image" v-if="imageUrl"/>
    </div>
  </div>
</template>

<style>
body {
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.testovichok {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: darkcyan;
  color: white
}

.input-weather {
  padding: 12px 20px;
  width: 300px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  color: #2c3e50;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
  inset 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  outline: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.input-weather::placeholder {
  color: #95a5a6;
  font-style: italic;
}

.input-weather:focus {
  background-color: white;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15),
  inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.input-weather:hover {
  background-color: rgba(255, 255, 255, 0.95);
}

/* Для темной темы */
.dark-theme .input-weather {
  background-color: rgba(30, 39, 46, 0.9);
  color: #ecf0f1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3),
  inset 0 1px 3px rgba(255, 255, 255, 0.1);
}

.dark-theme .input-weather::placeholder {
  color: #bdc3c7;
}

/* Анимация для эффекта "погодности" */
@keyframes weatherPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(52, 152, 219, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
  }
}

.input-weather.loading {
  animation: weatherPulse 1.5s infinite;
  position: relative;
}

/* Иконка внутри инпута */
.input-container {
  position: relative;
  margin: 20px 0;
}

.input-container::after {
  content: '🔍';
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.6;
  pointer-events: none;
  transition: opacity 0.3s;
}

.input-container:focus-within::after {
  opacity: 0;
}

.weather-app {
  min-height: 100vh;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.weather-main {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.centerImage {
}

p {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>