<template>
	<div class='mini_modal'>
		<div class='cross' @click='exitModal'>
			<unicon name="times" fill="gray"  />
		</div>
		<div v-if='obj'>
      <strong>Добавить Характеристики к материалу</strong>
      <button
        class='btn-small'
        v-if='!obj.lenght'
        @click='changes("lenght")' >   Добавить Длину (Д)</button>
      <button
        class='btn-small'
        v-if='!obj.width'
        @click='changes("width")'>    Добавить Ширина (Ш)</button>
      <button
        class='btn-small'
        v-if='!obj.height'
        @click='changes("height")'>   Добавить Высота (В)</button>
      <button
        class='btn-small'
        v-if='!obj.wallThickness'
        @click='changes("wallThickness")'>   Добавить Толщина Стенки (ТС)</button>
      <button
        class='btn-small'
        v-if='!obj.diametr'
        @click='changes("diametr")'>   Добавить Наружный Диаметр (НД)</button>
      <button
        class='btn-small'
        v-if='!obj.thickness'
        @click='changes("thickness")'>   Добавить Толщина (Т)</button>
      <button
        class='btn-small'
        v-if='!obj.areaCS'
        @click='changes("areaCS")'>   Добавить Площадь Сечения (ПС)</button>
    </div>
	</div>
</template>
<script>

export default {
	props: {
    obj: {}
  },
	data() {
		return {
		}
	},
	components: {
	},
	methods: {
		exitModal() {
			this.$emit('unmount', false);
		},
    changes(type) {
      this.$emit('unmount_change_har', type)
    }
	}
}
</script>

<style scoped>
  button {
    width: 100%;
  }
</style>