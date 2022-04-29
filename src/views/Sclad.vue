<template>
  <div class='main_container_sclad'>
    <div class="left_control">
       <div class='first_container_left_block'>
          <div>
            <h3>Склад продукции</h3>
            <div class="block">
              <div class="type-operation" @click="$router.push('/deficitizd')">Дефицит Продукции</div>
              <div class="type-operation" @click="$router.push('/deficitprod')">Дефицит Сборочных Едениц</div>
              <div class="type-operation" @click="$router.push('/deficitdetal')">Дефицит Деталей</div>
              <div class="type-operation" @click="$router.push('/ostatokprod')">Остатки продукции, сборок и деталей на складе</div>
            </div>
        </div>
        <div>
          <h3>Склад Материалы</h3>
          <div class="block">
            <div class="type-operation" @click="$router.push('/deficitmaterial')">Дефицит материалов</div>
            <div class="type-operation" @click="$router.push('/ostatolmat')">Остатки материалов на складе</div>
            <div class="type-operation" @click="$router.push('/ordersuppliers')">Заказаны у поставщиков</div>
            <div class="type-operation" @click="$router.push('/ordertoway')">Заказано / в пути</div>
            <div class="type-operation" @click="$router.push('/ordercomplit')">Отгруженные заказы</div>
          </div>
        </div>
       </div> 
       <div class="footer_left_container">
         <div class="type-operation" @click="$router.push('/consumptionall')">Среднестатистическое потребление / Расход ВСЕГО</div>
         <div class="type-operation" @click="$router.push('/comingsclad')">Приход на склад от поставщиков и производства</div>
         <div class="type-operation" @click="$router.push('/consumptionsclad')">Расход со склада</div>
         <div class="type-operation" @click="$router.push('/movingorder')">Перемещение: склад / производство / офис</div>
         <div class="type-operation" @click="$router.push('/scladtrash')">Склад отходов</div>
       </div>
    </div>
    <div class="right_control">
      <h3>Потребности на план</h3>
      <div class="block">
        <div class="type-operation" @click="$router.push('/issuetopull')">Задачи на отгрузку</div>
        <div class="type-operation" @click="$router.push('/defmatplan')">Дефицит материалов на план (металлообработка)</div>
        <div class="type-operation" @click="$router.push('/defmatplanass')">Дефицит материалов на план (сборка)</div>

        <h3>Комплектация производства (зачистные и заготовительные операции</h3>
        <div class="small-width-div type-operation" @click="$router.push('/cuttingcircle')">Резка круга / профиля</div>
        <div class="small-width-div type-operation" @click="$router.push('/cuttinglist')">Резка листа</div>
        <div class="direction_flex">
          <div class="type-operation" @click="$router.push('/completassembl')">Комплектация сборок на план</div>
          <div class="type-operation" @click="$router.push('/complectizd')">Комплектация Изделей на план</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main_container_sclad {
  display: flex;
  margin-top: 20px;
}
.main_container_sclad * {
  margin: 5px;
}
.direction_flex {
  display: flex;
}
.left_control {
  width: 600px;
  display: flex;
  flex-direction: column;
}
.first_container_left_block {
  display: flex;
  justify-content: center;
}
.footer_left_container>div {
  width: 90%;
}
.footer_left_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.type-operation {
  text-align: center;
}
.right_control {
  width: 600px;
  padding: 5px;
}
.right_control .block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.small-width-div {
  width: 90%;
}
</style>