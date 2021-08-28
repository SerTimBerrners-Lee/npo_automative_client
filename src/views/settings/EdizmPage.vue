<template>
    <div>
        <h3>Единицы измерения</h3>
        <div class="cont">
            <table class="edizm-table">
                <tr>
                    <th>Краткая запись</th>
                    <th>Полная запись</th>
                </tr>
                <tr>
                    <th colspan="2" scope="colgroup">Единицы длины</th>
                </tr>
                <tr>
                    <td>мм.</td>
                    <td>миллиметр</td>
                </tr>
                <tr>
                    <th colspan="2" scope="colgroup">Единицы площади</th>
                </tr>
                <tr>
                    <td>мм2</td>
                    <td>квадратный миллиметр</td>
                </tr>
                <tr>
                    <th colspan="2" scope="colgroup">Единицы объема</th>
                </tr>
                <tr>
                    <td>...</td>
                    <td>...</td>
                </tr>
                <tr>
                    <th colspan="2" scope="colgroup">Единицы массы</th>
                </tr>
                <tr>
                    <td>...</td>
                    <td>...</td>
                </tr>
                <tr>
                    <th colspan="2" scope="colgroup">Технические единицы</th>
                </tr>
                <tr>
                    <td>...</td>
                    <td>...</td>
                </tr>
                <tr>
                    <th colspan="2" scope="colgroup">Единицы времени</th>
                </tr>
                <tr>
                    <td>...</td>
                    <td>...</td>
                </tr>
                <tr>
                    <th colspan="2" scope="colgroup">Экономические единицы</th>
                </tr>
                <tr>
                    <td>...</td>
                    <td>...</td>
                </tr>
            </table>

            <div class="btn-control">
                <button class="btn-add btn-small">Создать</button>
                <button class="btn-small">Редактировать</button>
                <button class="btn-small">Удалить</button>
            </div>
        </div>
    </div>
</template>

<style >
.cont {
    width: max-content;
}
.edizm-table th {
    text-align: start;
}
</style>