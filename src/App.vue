<script setup>
import {ref, computed} from 'vue'
import {debounce} from "lodash";

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
    console.log(`./assets/images/${name}_t.png`)
    return new URL(`./assets/images/${name}_t.png`, import.meta.url).href;
  } catch (err) {
    console.log('Ошибка загрузки изображения:', err);
  }
}


const debounced = debounce(fetchWeather, 500)
</script>

<template>
  <div class="testovichok">
    <div>
      <input v-model="inputValue" @input="debounced" placeholder="Введите текст"/>
      <p>Вы ввели: {{ inputValue }}</p>
    </div>
    <div v-if='someShit?.main' class="weather-main">
      <p>Температура: {{ someShit.main.temp }}°C</p>
      <p>Ощущается как: {{ someShit.main.feels_like }}°C</p>
    </div>

    <img :src="imageUrl" alt="Dynamic Image" v-if="imageUrl"/>
  </div>
</template>

<style>
body {
  width: 100%;
  margin: 0;
  padding: 0
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

</style>