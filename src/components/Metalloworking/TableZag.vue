<template>
  <tbody v-if='searchParams(detal)'>
    <tr v-if='detal?.lengt'>
      <td>L</td>
      <td>мм</td>
      <td>{{ detal?.lengt }}</td>
    </tr>
    <tr v-if='detal?.width'>
      <td>A</td>
      <td>мм</td>
      <td>{{ detal?.width }}</td>
    </tr>
    <tr v-if='detal?.height'>
      <td>B</td>
      <td>мм</td>
      <td>{{ detal?.height }}</td>
    </tr>
    <tr v-if='detal?.wallThickness'>
      <td>C</td>
      <td>мм</td>
      <td>{{ detal?.wallThickness }}</td>
    </tr>
    <tr v-if='detal?.diametr'>
      <td>D</td>
      <td>мм</td>
      <td>{{ detal?.diametr }}</td>
    </tr>
    <tr v-if='detal?.thickness'>
      <td>H</td>
      <td>мм</td>
      <td>{{ detal?.thickness }}</td>
    </tr>
    <tr v-if='detal?.areaCS'>
      <td>S</td>
      <td>м.кв</td>
      <td>{{ Number(detal?.areaCS)?.toFixed(3) }}</td>
    </tr>
  </tbody>
  <p v-else class='center'>-</p>
</template>


<script>
export default {
  props: {
    detal: {
      type: Object
    }
  },
  methods: {
    searchParams(det) {
			if(!det) return false;

			if(!det?.lengt && !det?.width && 
				!det?.height && !det?.wallThickness &&
				!det?.diametr && !det?.thickness && 
				!det?.areaCS) return false;

			return true;
		}
  }
}
</script>

<style scoped>
td {
  padding: 3px;
}
</style>