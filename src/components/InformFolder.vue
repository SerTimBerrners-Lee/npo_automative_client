<template>
  <div class='main' v-if='messages.length'>
    <div v-for='(message, inx) of messages' :key='message' >
      <div class="message-folder-block" :class="message.typeMessage">
        <div>
          <span class="message-block-title">{{ message.title }}</span>
          <div @click="destroyInformFolder(inx)">
            <unicon name="times" fill="black" width="25px" />
          </div>
        </div>
        <p v-html='message.message'></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['title', 'message', 'type'],
  data() {
    return {
      typeMessage: 'inform-message',
      messages: []
    }    
  },
  updated() {
    setTimeout(() => this.messages.pop(), 7000)
  },
  methods: {
    destroyInformFolder(inx) {
    let new_arr = []
    for(let index in this.messages) 
      if(index != inx) new_arr.push(this.messages[index])
    this.messages = new_arr
    },
  },
  mounted() {
    if(!this.typeMessage || !this.message) return false
    this.$props.type == 'w' ?
      this.typeMessage = 'warning-message' :
      this.$props.type == 'e' ?
        this.typeMessage = 'error-message' :
        this.$props.type == 's' ?
          this.typeMessage = 'success-message' :
            this.typeMessage = 'inform-message'
    
    this.messages.push({
      typeMessage: this.typeMessage,
      title: this.$props.title,
      message: this.$props.message
    })
  }
}
</script>

<style scoped>
.main{
  z-index: 1111111;
  position: fixed;
  top: 20px;
  right: 20px;
}
.message-folder-block {
  
  border-radius: 6px 6px 0px 0px;
  padding-left: 10px;
  margin-top: 10px;
  opacity: 0.8;
  display: flex;
  flex-direction: column;
  width: max-content;
  max-width: 610px;
  word-wrap: break-word;
}
.message-folder-block>div {
  display: flex;
  justify-content: space-between;
}
.message-folder-block>div>div{
  cursor: pointer;
  margin-right: 3px;
}
.message-folder-block span, 
.message-folder-block p {
  margin-right: 20px;
}
.inform-message {
  border-bottom: 4px solid #0074d9;
  background: #d7dfe6;
}
.error-message {
  border-bottom: 4px solid #ee0000;
  background: #ffc2c2;
}
.warning-message {
  border-bottom: 4px solid #ffa700;
  background: #ffee63;
}
.success-message {
  border-bottom: 4px solid #2c9b00;
  background: #bdffa9;
}
.message-block-title {
  font-size: 20px;
  font-weight: bold;
  margin: 5px;
  margin-top: 13px;
}
.message-folder-block>span:last-child {
  margin-left: 5px;
}
</style>