<template>
  <div>
    <h1>Счетчик</h1>
    <div class='main_btn'>
      <h3> count: {{ count }} </h3>
      <div>
        <button class='btn btn-add' @click="increment">+</button>
        <button class='btn btn-del' @click="decriment">-</button>
      </div>
    </div>

    <p>Вы кликнули всего: {{ counter_click }} кол-во раз.</p>
    <p>Вы кликнули На минус: {{ click_min }} кол-во раз.</p>
    <p>Вы кликнули На плюc: {{ click_plus }} кол-во раз.</p>

  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
      counter_click: 0,

      click_min: 0,
      click_plus: 0
    }
  },
  watch: {
    count: function(new_val, last_val) {
      console.log('watch:', new_val, last_val);
    }
  },
  methods: {
    increment() {
      this.count++
      this.counter_click++
      this.click_plus++
    },
    decriment() {
      this.count--
      this.counter_click++
      this.click_min++
    }
  }
}
</script>

<style scoped>
.btn {
  width: 100px;
  font-size: 20px;
}
.main_btn {
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(155, 155, 155);
  width: 300px;
  padding: 10px;
  border-radius: 10px;
  justify-content: center;
  box-shadow: 2px 1px 1px 1px rgb(212, 212, 212);
}
.main_btn  * {
  display: flex;
  justify-content: center;
}
</style>