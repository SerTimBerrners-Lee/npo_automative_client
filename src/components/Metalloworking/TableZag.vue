<template>
  <div v-if='detal'>
    <tbody v-if='format !== "json" && searchParams(detal)'>
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

    <tbody v-if='format == "json"'>
      <tr v-if='detal?.length'>
        <td>Д</td>
        <td>мм</td>
        <td>{{ returnNumZnach(detal.length) }}</td>
      </tr>
      <tr v-if='detal?.width'>
        <td>Ш</td>
        <td>мм</td>
        <td>{{ returnNumZnach(detal.width) }}</td>
      </tr>
      <tr v-if='detal?.height'>
        <td>В</td>
        <td>мм</td>
        <td>{{ returnNumZnach(detal.height) }}</td>
      </tr>
      <tr v-if='detal?.wallThickness'>
        <td>ТС</td>
        <td>мм</td>
        <td>{{ returnNumZnach(detal.wallThickness) }}</td>
      </tr>
      <tr v-if='detal?.outsideDiametr'>
        <td>НД</td>
        <td>мм</td>
        <td>{{ returnNumZnach(detal.outsideDiametr) }}</td>
      </tr>
      <tr v-if='detal?.thickness'>
        <td>Т</td>
        <td>мм</td>
        <td>{{ returnNumZnach(detal.thickness) }}</td>
      </tr>
      <tr v-if='detal?.areaCrossSectional'>
        <td>ПС</td>
        <td>м.кв</td>
        <td>{{ returnNumZnach(detal.areaCrossSectional) }}</td>
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
    format: {
      type: String,
      default: 'obj' // 'obj' || 'json'
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
		},
    returnNumZnach(har) {
      if (!har) return '';
      try {
        const hh = JSON.parse(har);
        return hh.znach;
      } catch(err) {console.error(err)}
      return '';
    }
  },
}
</script>

<style scoped>
td {
  padding: 3px;
}
</style>