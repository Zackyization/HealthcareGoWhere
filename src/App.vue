<template>
  <header>
    <nav>
      <div class="flex justify-center items-center">
        <img src="../src/assets/logo.png" alt="Logo" class="h-8">
        <h1>Healthcare<span class="red">GoWhere</span></h1>
      </div>
    </nav>
  </header>
  <div id="app">
    <HomePage />
  </div>
</template>

<script>
import HomePage from './components/HomePage.vue'

export default {
  name: 'App',
  components: {
    HomePage
  }
}
</script>

<style>
#app {
  font-family: 'Urbanist', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
    background-color: #cbe9ec;
}

nav h1 {
  font-weight: bold;
}

nav .red {
  color: #F85065;
}
</style>
