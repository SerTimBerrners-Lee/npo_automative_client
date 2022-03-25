<template>
  <div>
    <table style='width: 100%' v-if='arrFileGet.length'>
      <tr>
        <th>Файл</th>
      </tr>
      <tr 
        v-for='doc in  arrFileGet' 
        :key='doc'
        class='td-row'
        @click='element => select(doc, element.target)'
        @dblclick="openFiles(doc)"
        >
        <td>{{ doc.name }}</td>
      </tr>
    </table>
    <OpensFile 
      :parametrs='itemFiles' 
      v-if="showFile" 
      :key='keyWhenModalGenerateFileOpen'
    />
  </div>
</template>


<script>
import { random } from 'lodash';
import { eSelectSpan } from '@/js/methods';
import OpensFile from '@/components/filebase/openfile';

export default {
  props: {
    arrFileGet: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tr: null,
      itemFiles: null,
      showFile: false,
      keyWhenModalGenerateFileOpen: random(10, 999),
    }
  },
  components: {
    OpensFile
  },
  methods: {
    select(doc, element) {
      this.tr = eSelectSpan(this.tr, element);
      this.$emit('unmount', doc);
    },
    openFiles(doc) {
      this.itemFiles = doc;
      this.keyWhenModalGenerateFileOpen = random(1, 999);
      this.showFile = true;
    }
  }
}
</script>