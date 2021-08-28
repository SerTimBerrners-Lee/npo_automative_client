<template>
    <div>
        <div class="nav-base-file-page">
            <div class="left-div-bfp">
                <h3>База файлов</h3>
                <div class="type-issue">
                    <span>Все</span>
                    <span>Архив</span>
                    <span>Неприсвоенные</span>
                    <span>Без типа</span>
                </div>
                <div class="type-issue">
                    <span>Медиа (тип МД)</span>
                    <span>Конструкторская документация (тип КД)</span>
                    <span>Чертижи (тип ЧЖ)</span>
                    <span>Сопутствующие документы (тип СД)</span>
                </div>

                <div class="scroll-table" style="height: 600px;">
                    <table>
                        <tr >
                            <th>Тип</th>
                            <th>Наименование</th>
                            <th>Дата</th>
                            <th>Примечание</th>
                        </tr>
                        <tr v-for="h in 5" :key="h" class="td-row">
                            <td>МД</td>
                            <td width="400px">Видеопрезентация КПП1000Р60.ьз4</td>
                            <td>12.01.2020</td>
                            <td class="width-350">...</td>
                        </tr>
                        <tr v-for="h in 20" :key="h" class="td-row">
                            <td>...</td>
                            <td width="400px">...</td>
                            <td>...</td>
                            <td class="width-350">...</td>
                        </tr>
                    </table>
                </div>
                <div class="btn-control">
                    <select name="" id="" class="select-small">
                        <option>Изменить тип</option>
                        <option>Медиа (тип МД)</option>
                        <option>Конструкторская документация (тип КД)</option>
                        <option>Чертижи (тип ЧЖ)</option>
                        <option>Сопутствующие документы (тип СД)</option>
                    </select>
                    <button class="btn-small">Присвоить к...</button>
                    <button class="btn-small">Открыть</button>
                    <button class="btn-small">Редактировать</button>
                </div>
                <div class="btn-control">
                    <button class="btn-small">Вернуть из архива</button>
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