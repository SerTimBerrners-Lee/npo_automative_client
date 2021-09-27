<template>
    <div>
        <h3>14. Разделы библиотеки</h3>
        <img style='position: fixed ;
                z-index: 12;
                width: 700px;
                margin: 0 auto;
                left: 0;
                right: 0;' 
                src="@/assets/img/unnamed.jpg" 
                alt="На реставрации ">
        <div class="cont">
            <table>
                <tr>
                    <th>№</th>
                    <th class="width-350">Наименование раздела</th>
                </tr>
                <tr class="td-row">
                    <td>1</td>
                    <td>Гидравлика</td>
                </tr>
                <tr class="td-row">
                    <td>2</td>
                    <td>Пневматика</td>
                </tr>
                <tr class="td-row">
                    <td>3</td>
                    <td>Автоматика</td>
                </tr>
            </table>
            <div class="btn-control">
                <button class="btn-small btn-add">Создать</button>
                <button class="btn-small">Редактировать</button>
                <button class="btn-small">Удалить</button>
            </div>
        </div>
    </div>
</template>