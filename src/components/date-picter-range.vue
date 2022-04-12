<template>
	<div class='picter'>
		<DatePicker 
			:masks='masks'
      v-model='range'
			is-dark 
      is-range
			color='gray'
			:select-attribute='modelAttribute'
		> 
			<template v-slot="{ inputValue, inputEvents }">
        <div class='block-picter'>
          <span>Выбрать период, с:</span>
          <input
            :value="inputValue.start"
            v-on="inputEvents.start"
          />
          <span>по: </span>
          <input
            :value="inputValue.end"
            v-on="inputEvents.end"
          />
          <button class="btn-small" @click='clearDate'>Сбросить период или дату</button>
      </div>
			</template>
		</DatePicker>
	</div>
</template>
<script>
export default {
	data() {
		return {
      masks: {
        input: 'DD.MM.YYYY'
      },
			modelAttribute: {
				dot: true,
			},
      range: {
        end: new Date(),
        start: new Date()
      }
		}
	},
  watch: {
    range: function(val) {
      console.log(this.range)
      this.$emit('unmount', val);
    }
  },
  methods: {
    clearDate() {
      this.range = null;
    }
  }
}
</script>

<style scoped>
input {
	width: 80px;
}
.picter {
	widows: fit-content;
}
.block-picter *  {
  margin-left: 8px;
}
</style>