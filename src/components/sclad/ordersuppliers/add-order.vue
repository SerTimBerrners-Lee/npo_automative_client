<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Создание заказа поставщика</h3>
        <div class="block header_block">
          <span>Выбор поставщика:</span>
          <input type="text">
          <button class="btn-small">Выбрать</button>
        </div>
        
        <div class="block two_header">
          <p>
            <span>№ Счета: </span>
            <input type="text">
            <span>Сумма счета, руб:</span>
            <input type="text">
          </p>
          <p>
            <span>Планируемая дата прихода:</span>
            <input type="text">
            <span>НДС: </span>
            <input type="text">
          </p>
        </div>

        <div class="block" style='padding: 5px;'>
          <p style='margin: 5px;'>
            <button class="btn-small">Загрузить счет</button>
            <span></span>
          </p>
        </div>

        <div>
          <h3>Список поставляемого поставщиком</h3>
        </div>

        <div>
          <h3>Выбранные позиции</h3>
          <div class="table-scroll">
            <table>
              <tr>
                <th>Артикул</th>
                <th>Наименование</th>
                <th>ЕИ</th>
                <th>Кол-во</th>
                <th>Сумма, руб</th>
                <th>Примечание</th>
              </tr>
            </table>
          </div>
          <div class="btn-control">
            <button class="btn-small">Очистить</button>
            <button class="btn-small">Удалить выбранное</button>
          </div>
        </div>

        <div class="btn-control out-btn-control">
          <button class="btn-status" @click='destroyModalF'>Отменить</button>
          <button class="btn-status btn-black">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
    props: ['parametrs'],
    data() {
        return {
            destroyModalLeft: 'left-block-modal',
            destroyModalRight: 'content-modal-right-menu',
            hiddens: 'opacity: 1;',
            
        }
    },
    async mounted() {
        this.destroyModalLeft = 'left-block-modal'
        this.destroyModalRight = 'content-modal-right-menu'
        this.hiddens = 'opacity: 1;'
    },
    methods: {
      destroyModalF() {
        this.destroyModalLeft = 'left-block-modal-hidden'
        this.destroyModalRight = 'content-modal-right-menu-hidden'
        this.hiddens = 'display: none;'
      },
    }
}
</script>

<style scoped>
.header_block input{
  width: 50%;
}
.block {
  margin-bottom: 10px;
}
table {
  width: 100%;
}
.two_header * {
  margin:4px;
}
.two_header input{
  width:23%;
}
.two_header  p {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content-modal-right-menu-hidden {
    animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
    animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
    animation: width 1s 1 ease;

    width: 40vw;
}
.left-block-modal {
    width: 60vw;
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
        width: 1vw;
    }
    to {
        width: 40vw;
    }
}
@keyframes width-right {
    from {
        width: 0vw;
    }
    to {
        width: 60vw;
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
        width: 60vw;
    }
    to {
        width: 00vw;
    }
}
@keyframes width-right-replace {
    from {
        width: 50vw;
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