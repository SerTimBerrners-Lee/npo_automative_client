<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>{{ is_type == 'cb' ? "Сборочные единицы" : 'Детали' }} по операциям</h3>
				<div class="operation-block">
					<div 
						class="type-operation" 
						v-for='oper of parametrs' 
						:key='oper'
            @click='showOperation(oper)'>
						<span>{{ oper.id }}.</span>
						<span>{{ oper.name }}</span>
					</div>
				</div>

      </div>
    </div>
  </div> 
</template>
<script>
export default {
  props: ['parametrs', 'is_type'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',

    }
  },
  components: {},
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    showOperation(oper) {
      if(this.$props.is_type == 'cb')
        this.$router.push({path: `/assembly/operation-assemble/${oper.id}/${oper.name}`})
      if(this.$props.is_type == 'det')
        this.$router.push({path: `/metalloworking/OperationMetall/${oper.id}/${oper.name}`})
    }

  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
  }
}
</script>

<style scoped>
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  height: 100vh;
  width: 70%;
}
.left-block-modal {
  width: 30%;
  height: 10000px;
  animation: width-right 1s 1 ease;
}
.left-block-modal-hidden {
  animation: width-right-replace 1s 1 ease;
}
.content-modal-right-menu>div {
  animation: hidden-content 1s 1 ease;
}
@keyframes width {
  from {
    width: 1%;
  }
  to {
    width: 70%;
  }
}
@keyframes width-right {
  from {
    width: 0%;
  }
  to {
    width: 30%;
  }
}
@keyframes hidden-content {
  from {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
@keyframes width-replace {
  from {
    width: 30vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 70vw;
  }
  to {
    width: 0vw;
  }
}
@keyframes hidden-content-replace {
  from {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
</style>