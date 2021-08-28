<template>
    <div>
        <div class="nav-base-file-page">
            <div class="left-div-bfp">
                <h3>База материалов</h3>
                <div class="type-issue">
                    <span>Все</span>
                    <span>Материалы для деталей</span>
                    <span>Покупные детали</span>
                    <span>Расходные материалы</span>
                </div>

                <div class="scroll-table" style="height: 540px;">
                    <table>
                        <tr >
                            <th>Тип (профиля заготовки)</th>
                            <th>Подтип (Материал заготовки)</th>
                            <th>Наименование (Марка / типоразмер)</th>
                        </tr>
                        <tr v-for="h in 15" :key="h" class="td-row">
                            <td>Металлопрокат</td>
                            <td width="400px">Сталь 40Х</td>
                            <td>Круг Сталь 40xD 10мм </td>
                        </tr>
                    </table>
                </div>

                <div class="btn-control">
                    <button class="btn-small btn-add">Создать</button>
                    <button class="btn-small btn-add">Создать копированием</button>
                    <button class="btn-small">Редактировать</button>
                </div>
                <div class="btn-control">
                    <button class="btn-small">В архив</button>
                </div>
            </div>
            <div class="right-div-bfp">
                <h3>Принадлежность</h3>
                <div class="block">
                    <h3>Изделие</h3>
                    <div class="scroll-table table-fbp">
                        <table>
                        <tr>
                            <th>Артикул </th>
                            <th>Наименование</th>
                        </tr>
                        <tr class="td-row">
                            <td>ВШ70-250</td>
                            <td>Выприсовщик скворней</td>
                        </tr>
                        <tr class="td-row">
                            <td>ВШ7250</td>
                            <td>Выприсовщик сайлендблоков</td>
                        </tr>
                    </table>
                    </div>
                    <h3>Сборочная единица</h3>
                    <div class="scroll-table table-fbp">
                        <table>
                        <tr class="td-row">
                            <th>Артикул </th>
                            <th>Наименование</th>
                        </tr>
                        <tr v-for="u in 50" :key="u" class="td-row">
                            <td>25567 + {{ u * 34}}</td>
                            <td>Цилиндр</td>
                        </tr>
                    </table>
                    </div>
                    <h3>Деталь</h3>
                    <div class="scroll-table table-fbp">
                        <table>
                        <tr class="td-row">
                            <th>Артикул </th>
                            <th>Наименование</th>
                        </tr>
                        <tr class="td-row">
                            <td>34534550</td>
                            <td>Шток</td>
                        </tr>
                        <tr class="td-row">
                            <td>435345350</td>
                            <td>Корпус</td>
                        </tr>
                        <tr class="td-row">
                            <td>56465</td>
                            <td>Крышка</td>
                        </tr>
                    </table>
                    </div>
                </div>
                <div class="btn-control">
                    <button class="btn-small">
                        Сохранить в виде отчета EXEL
                    </button>
                </div>
            </div>
        </div>
    </div>
</template> 

<style scoped>
    .table-fbp {
        width:100%;
        max-height: 250px;
        height: auto;
    }
    .table-fbp table {
        width: 100%
    }
    .nav-base-file-page {
        display: flex;
    }
    .right-div-bfp {
        width: 414px;
        margin-left: 10px;
    }
</style>