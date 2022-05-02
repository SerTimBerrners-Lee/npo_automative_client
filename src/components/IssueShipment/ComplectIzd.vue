<template>
  <div v-if='show'>
    <h3>Комплектация изделия</h3>
    <table>
      <tr>
        <th>№</th>
        <th>Артикул</th>
        <th>Наименование СБ или детали</th>
        <th>Кол-во</th>
      </tr>
      <tr
        v-for='(obj, inx) of list_cbed_detal'
        :key='obj'
        class='td-row'>
        <td class='center'>{{ inx + 1 }}</td>
        <td>{{ obj.obj?.articl }}</td>
        <td>{{ obj.obj?.name }}</td>
        <td class='center'>
          <input
            type="text"
            :value='obj.kol'
            class='input_kol center'
            disabled>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    show: {},
    list_cbed_detal: {},
  },
}
</script>