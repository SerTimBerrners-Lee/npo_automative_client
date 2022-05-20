<template>
  <div v-if='detal'>
    <tbody v-if='searchParams(detal)'>
      <tr v-if='detal?.lengt'>
        <td>Д</td>
        <td>мм</td>
        <td>{{ detal.lengt }}</td>
      </tr>
      <tr v-if='detal?.width'>
        <td>Ш</td>
        <td>мм</td>
        <td>{{ detal.width }}</td>
      </tr>
      <tr v-if='detal?.height'>
        <td>В</td>
        <td>мм</td>
        <td>{{ detal.height }}</td>
      </tr>
      <tr v-if='detal?.wallThickness'>
        <td>ТС</td>
        <td>мм</td>
        <td>{{ detal.wallThickness }}</td>
      </tr>
      <tr v-if='detal?.diametr'>
        <td>НД</td>
        <td>мм</td>
        <td>{{ detal.diametr }}</td>
      </tr>
      <tr v-if='detal?.thickness'>
        <td>Т</td>
        <td>мм</td>
        <td>{{ detal.thickness }}</td>
      </tr>
      <tr v-if='detal?.areaCS'>
        <td>ПС</td>
        <td>м.кв</td>
        <td>{{ Number(detal.areaCS)?.toFixed(3) }}</td>
      </tr>
    </tbody>
  </div>
  <p v-else class='center'>-</p>
</template>


<script>
export default {
  props: {
    detal: {
      type: Object
    },
  },
  methods: {
    searchParams(det) {
      if(!det) return false;

			if(!det?.lengt && !det?.width && 
				!det?.height && !det?.wallThickness &&
				!det?.diametr && !det?.thickness && 
				!det?.areaCS) return false;

			return true;
		},
  },
}
</script>

<style scoped>
td {
  padding: 3px;
}
</style>