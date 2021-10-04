<template>
    <div class="nav-menu">
        <ul class="menu-ul scroll">
            <li class="item-lu" @click="$router.push('/product')">
                <img src="@/assets/img/shop.png" alt="" class="icon-li">
                <span class="text-item">Продукция НПО Автомотив</span>
            </li>
            <li class="item-lu" @click="$router.push('/resultwork')">
                <img src="@/assets/img/img2.png" alt="" class="icon-li">
                <span class="text-item">Результаты работы</span>
            </li>
            <li class="item-lu" @click="$router.push('/library')">
                <img src="@/assets/img/img3.png" alt="" class="icon-li">
                <span class="text-item">Библиотека</span>
            </li>
            <li class="item-lu" @click="$router.push('/issues')">
                <img src="@/assets/img/img4.png" alt="" class="icon-li">
                <span class="text-item">Задачи</span>
            </li>
            <li class="item-lu" @click="$router.push('/cbed')">
                <img src="@/assets/img/img5.png" alt="" class="icon-li">
                <span class="text-item">База сборочных едениц</span>
            </li>
            <li class="item-lu" @click="$router.push('/basedetals')">
                <img src="@/assets/img/img6.png" alt="" class="icon-li">
                <span class="text-item">База деталей</span>
            </li>
            <li class="item-lu" @click="$router.push('/basematerial')">
                <img src="@/assets/img/img7.png" alt="" class="icon-li">
                <span class="text-item">База материалов</span>
            </li>
            <li class="item-lu" @click="$router.push('/basetools')">
                <img src="@/assets/img/img8.png" alt="" class="icon-li">
                <span class="text-item">База инструмента и оснастки</span>
            </li>
            <li class="item-lu" @click="$router.push('/baseequipment')">
                <img src="@/assets/img/img9.png" alt="" class="icon-li">
                <span class="text-item">База оборудования</span>
            </li>
            <li class="item-lu">
                <img src="@/assets/img/img10.png" alt="" class="icon-li">
                <span class="text-item">База техники и инвентаря</span>
            </li>
            <li class="item-lu" @click="$router.push('/baseprovider')">
                <img src="@/assets/img/img11.png" alt="" class="icon-li">
                <span class="text-item">База поставщиков</span>
            </li>
            <li class="item-lu" @click="$router.push('/basebuyer')">
                <img src="@/assets/img/999.png" alt="" class="icon-li">
                <span class="text-item">База покупателей</span>
            </li>
            <li class="item-lu" @click="$router.push('/filebase')">
                <img src="@/assets/img/img12.png" alt="" class="icon-li">
                <span class="text-item">База файлов</span>
            </li>
            <li class="item-lu" @click="$router.push('/issueshipment')">
                <img src="@/assets/img/img13.png" alt="" class="icon-li">
                <span class="text-item">Задачи на отгрузку</span>
            </li>
            <li class="item-lu" @click="$router.push('/sclad')">
                <img src="@/assets/img/img14.png" alt="" class="icon-li">
                <span class="text-item">Склад</span>
            </li>
            <li class="item-lu" @click="$router.push('/metalloworking')">
                <img src="@/assets/img/img15.png" alt="" class="icon-li">
                <span class="text-item">Металлообработка</span>
            </li>
            <li class="item-lu" @click="$router.push('/assembly')">
                <img src="@/assets/img/img16.png" alt="" class="icon-li">
                <span class="text-item">Сборка</span>
            </li>
            <li class="item-lu">
                <img src="@/assets/img/img17.png" alt="" class="icon-li">
                <span class="text-item">Брак</span>
            </li>
            <li class="item-lu">
                <img src="@/assets/img/img18.png" alt="" class="icon-li">
                <span class="text-item">Отходы</span>
            </li>
            <li class="item-lu">
                <img src="@/assets/img/img19.png" alt="" class="icon-li">
                <span class="text-item">Списание</span>
            </li>
            <li class="item-lu">
                <img src="@/assets/img/img20.png" alt="" class="icon-li">
                <span class="text-item">Отчеты</span>
            </li>
                        <li class="item-lu">
                <img src="@/assets/img/img21.png" alt="" class="icon-li">
                <span class="text-item">Рекламация</span>
            </li>
        </ul>
    </div>
</template>

<style>
    li {
        list-style-type: none;
        display: flex;
        cursor: pointer;
        padding-right: 15px;
        border-bottom: 1px solid #545454c7;
    }
    li:hover {
        background: #6a6a6a;
    }
    .nav-menu {
         background: #464646;
         color: #ececec;
         width: 200px;
         font-size: 12px;
         font-weight: bold;
         user-select: none;
         float: left;
         position: fixed;
         height: 100vh;
    }
    ul {
        margin-left: 0px;
        padding-left: 10px;
        padding-top: 30px;
        padding-bottom: 50px;;
        margin-top: 0px;
        height: 100%;
        overflow: auto;
        direction: ltr;
    }
    li>span {
        align-self: center;
        padding-left: 4px;
    }
</style>