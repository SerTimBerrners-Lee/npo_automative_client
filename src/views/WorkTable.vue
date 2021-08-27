<template>
    <div class="container">
        <div class="block-one">
            <h3>Задачи для меня</h3>
            <div class="type-issue">
                <span>Новые</span>
                <span>В работе</span>
                <span>Просроченные</span>
                <span>Выполненные</span>
                <span>Все</span>
            </div>
            <div class="scroll-table">
                <table class="issue-table">
                    <tr>
                        <th>№</th>
                        <th>Дата задачи</th>
                        <th>Источник</th>
                        <th>Исполнитель</th>
                        <th>Контроллер</th>
                        <th>Примечание</th>
                        <th>Срочность</th>
                        <th>Выполнить до</th>
                        <th>Статус</th>
                    </tr>
                    <tr>
                        <td>154632</td>
                        <td>30.03.2021</td>
                        <td>Битунов В.А.</td>
                        <td>Битунов В.А.</td>
                        <td>Битунов В.А.</td>
                        <td>Поменять размер в чертеже</td>
                        <td>Срочно</td>
                        <td>30.03.2021</td>
                        <td>Новое</td>
                    </tr>
                     <tr>
                        <td>154632</td>
                        <td>30.03.2021</td>
                        <td>Битунов В.А.</td>
                        <td>Битунов В.А.</td>
                        <td>Битунов В.А.</td>
                        <td>Поменять размер в чертеже</td>
                        <td>Срочно</td>
                        <td>30.03.2021</td>
                        <td>Новое</td>
                    </tr>
                     <tr>
                        <td>154632</td>
                        <td>30.03.2021</td>
                        <td>Битунов В.А.</td>
                        <td>Битунов В.А.</td>
                        <td>Битунов В.А.</td>
                        <td>Поменять размер в чертеже</td>
                        <td>Срочно</td>
                        <td>30.03.2021</td>
                        <td>Новое</td>
                    </tr>
                     <tr>
                        <td>154632</td>
                        <td>30.03.2021</td>
                        <td>Битунов В.А.</td>
                        <td>Битунов В.А.</td>
                        <td>Битунов В.А.</td>
                        <td>Поменять размер в чертеже</td>
                        <td>Срочно</td>
                        <td>30.03.2021</td>
                        <td>Новое</td>
                    </tr>
                    <tr>
                        <td>154632</td>
                        <td>30.03.2021</td>
                        <td>Битунов В.А.</td>
                        <td>Битунов В.А.</td>
                        <td>Битунов В.А.</td>
                        <td>Поменять размер в чертеже</td>
                        <td>Срочно</td>
                        <td>30.03.2021</td>
                        <td>Новое</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="block-two">
            <h3>План по операциям</h3>
            <div class="operation-block">
                <div class="type-operation">
                    <span>0.</span>
                    <span>Заготовительная</span>
                </div>
                <div class="type-operation">
                    <span>1.</span>
                    <span>Токарная</span>
                </div>
                <div class="type-operation">
                    <span>2.</span>
                    <span>Фрезерная</span>
                </div>
                <div class="type-operation">
                    <span>3.</span>
                    <span>Координатно-сверильная</span>
                </div>
                <div class="type-operation">
                    <span>4.</span>
                    <span>Сверлильная</span>
                </div>
                <div class="type-operation">
                    <span>5.</span>
                    <span>Термическая</span>
                </div>
                <div class="type-operation">
                    <span>6.</span>
                    <span>Сварочные работы</span>
                </div>
                <div class="type-operation">
                    <span>7.</span>
                    <span>Мойка</span>
                </div>
                <div class="type-operation">
                    <span>8.</span>
                    <span>Зачистные работы</span>
                </div>
                <div class="type-operation">
                    <span>9.</span>
                    <span>Слесарные</span>
                </div>
                <div class="type-operation">
                    <span>10.</span>
                    <span>Покраска</span>
                </div>
                <div class="type-operation">
                    <span>11.</span>
                    <span>Сборка</span>
                </div>
                <div class="type-operation">
                    <span>12.</span>
                    <span>Упаковка</span>
                </div>
            </div>
        </div>
        <div class="block-three">
            <h3>Результаты работы</h3>
            <div class="result-work">
                <span>Выбрать период, с: </span>
                <input type="text" class="calendar-input">
                <span>по: </span>
                <input type="text" class="calendar-input">
                <button>Сбросить период или дату</button>
                <span>Кол-во рабочих дней в периоде: </span>
                <input type="text" class="input-periud">
            </div>
            <div class="scroll-table">
                <table class="wort-page-table">
                    <tr>
                        <th colspan="11" scope="colgroup"></th>
                        <th colspan="3" scope="colgroup">За 1 шт.</th>
                        <th colspan="3" scope="colgroup">За партию.</th>
                        <th colspan="7" scope="colgroup"></th>
                    </tr>
                    <tr>
                        <th>Табельный номер</th>
                        <th>Сотрудник</th>
                        <th>Дата</th>
                        <th>Наименование действия(выполнение задания, выполнение операции с производства или сборки, действия в ПО Конструктор - создал, изменил и т.д)</th>
                        <th>Тип </th>
                        <th>Артикул</th>
                        <th>Наименование</th>
                        <th>Заказ</th>
                        <th>Время</th>
                        <th>Примечание</th>
                        <th>Кол-во, шт.</th>
                        <th>Подготовит-е время, н.ч.</th>
                        <th>Вспомогат-е время, н.ч.</th>
                        <th>Машинное время, н.ч.</th>
                        <th>Подготовит-е время, н.ч.</th>
                        <th>Вспомогат-е время, н.ч.</th>
                        <th>Машинное время, н.ч.</th>
                        <th>Всего, н.ч.</th>
                        <th>Задания, н.ч.</th>
                        <th>План за день, н.ч.</th>
                        <th>Итого по сотруднику за день.</th>
                        <th>План за период, н.ч.</th>
                        <th>Итого по сотруднику за период, н.ч.</th>
                        <th>Потери выработки за период, н.ч.</th>
                    </tr>
                </table>
            </div>
            <button class="print_btn">Печать</button>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style>
    .container {
        flex-direction: column;
        padding: 10px;
        margin: 40px;
        margin-left: 210px;
        padding-top: 40px;
    }
    .block-one span{
        margin: 10px;
        text-decoration: line;
        text-decoration: underline;
        cursor: pointer;
    }
    table {
        border: 1px solid #d3d3d3;
        border-collapse: collapse;
        margin-top: 10px;
        font-size: 16px;
    }
    .wort-page-table {
        font-size: 16px;
    }
    th {
        border: 1px solid #d3d3d3;
        padding: 10px;
    }
    td {
        border: 1px solid #d3d3d3;
        padding: 10px;
    }
    .block-one {
        width: max-content;
    }
    .scroll-table{
        height: 250px;
        overflow: auto;
        direction: ltr;
        width: inherit;
    }
    .print_btn {
        float: right;
        padding-left: 10px;
        padding-right: 10px;
        margin-top: 20px;
    }

</style>