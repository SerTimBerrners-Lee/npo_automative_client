<template>
  <div id="cover">
    <div class="tb">
      <div class="td">
        <input 
          type="text" 
          :placeholder="placeholder" 
          required
          v-model='input'
          @keyup.enter="e => key(e.target.value)"
          >
      </div>
      <div class="icon"  @click='key(input)'>
        <unicon name="search-alt"  fill='gray'/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['placeholder', 'search_data'],
  data() {
    return {
      input: '',
    }
  },
  methods: {
    key(val) {
      this.$emit('unmount', val);
    }
  },
  async mounted() {
    if(this.$props.search_data)
      this.input = this.$props.search_data;
  }
}
</script>

<style scoped>
  *
{
  outline: none;
}
.icon:hover {
  border-radius: 5px;
  border: 1px solid #ececec;
  background-color: #efefef;
  cursor: pointer;
}
input, button
{
  color: rgb(61, 61, 61);
  padding: 0;
  margin: 0;
  border: 0;
  background-color: transparent;
}

#cover
{
  width: 90%;
  padding-left: 2px;
  background-color: #f8f8f8;
  border-radius: 6px;
}
#cover:hover {
  box-shadow: 0 10px 20px #cecece, 0 0 0 10px #ffffffeb;
}
input[type="text"]
{
  width: 90%;
  font-size: 13px;
  line-height: 1;
}

input[type="text"]::placeholder
{
  color: #d4d4d4;
  font-size: 12px;
  font-weight: bold;
}
input[type="text"]:hover::placeholder
{
  color: #03030352;
    
}
.tb {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.td {
  width: 90%;
  height: 25px;
  display: flex;
  align-items: center;
}
.td input {
  height: 100%;
}

</style>