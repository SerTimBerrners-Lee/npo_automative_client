<template>
    <div>
        <h3>11. Учет рабочего времени</h3>

       <div class="cont">
            <span>Установка количества рабочих дней</span>
            <div class="block">
                <p>
                    <span>Выбор года: </span>
                    <input type="text" value="2021" style="margin-left: 10px; text-align: end;">
                </p>
            </div>

            <table>
                <tr>
                    <th>№</th>
                    <th>Месяц</th>
                    <th>Кол-во раб. дней</th>
                    <th>Рабочие часы</th>
                </tr>
                <tr v-for="(i, index) in [`Январь`, `Февраль`, `Март`, `Апрель`, `Май`, `Июнь`, `Июль`, `Август`, `Сентябрь`, `Октябрь`, `Ноябрь`, `Декабрь`]" :key="i ">
                    <td>{{ index + 1 }}</td>
                    <td>{{ i }}</td>
                    <td style="text-align: end;">21</td>
                    <td style="text-align: end;">{{ index + 198}}</td>
                </tr>
            </table>

       </div>
    </div>
</template>


<style scoped>
.cont>span {
    font-size: 21px;
}
.block {
    margin-top: 20px;
}


</style>