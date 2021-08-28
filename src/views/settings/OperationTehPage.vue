<template>
        <div class="main-dive">
        <h3>Операции технологического процесса</h3>
        <div class="cont">
            <div class="cont scroll-table scrolls-type-490">
                <table class="type-table">
                    <tr>
                        <th rowspan="2" scope="rowgroup">№</th>
                        <th rowspan="2" scope="rowgroup">Наименование операции </th>
                        <th colspan="3" scope="colgroup">Учет выработки сотрудником в нормо-часах</th>
                    </tr>
                    <tr>
                        <th>Подготовительное</th>
                        <th>Вспомогательное</th>
                        <th>Основное</th>
                    </tr>
                    <tr class="td-row" v-for="i in 20" :key="i">
                        <td>{{ i }}</td>
                        <td>Заготовительная</td>
                        <td class="checkeds"><input type="checkbox"></td>
                        <td class="checkeds"><input type="checkbox"></td>
                        <td class="checkeds"><input type="checkbox"></td>
                    </tr>
                </table>
            </div>
            <div class="btn-control">
                    <button class="btn-small btn-add">Создать</button>
                    <button class="btn-small">Редактировать</button>
                    <button class=" btn-small">Удалить</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    input {
        width: 22px;
        height: 22px;
    }
    .checkeds {
        text-align: center;
    }
</style>