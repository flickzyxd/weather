<script setup>
import {ref, computed} from 'vue'
import {debounce} from "lodash";
import {fetchWeather} from "@/services/weatherService.js";

const inputValue = ref('')
const someShit = ref(null)
const error = ref('')
const imageUrl = computed(() => {
  if (someShit.value !== null) {
    return imageTest(someShit.value.weather[0].icon)
  } else {
    return ''
  }
});

async function getWeather() {
  try{
    someShit.value = await fetchWeather(inputValue.value.trim())
  } catch (e) {
    error.value = e.value
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


const debounced = debounce(getWeather, 500)
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