<template>
    <div class="rout-nav">
        <span class="home-link">
                <unicon name="house-user" fill="black" icon-style="monochrome"/>
        </span>
    </div>
</template>

<script>
export default {
    
}
</script>

<style>
.rout-nav {
    border-bottom: 1px solid #d3d3d3;
    height: 35px;
    display: flex;
    align-items: center;
    float: left;
    background-color: rgb(235, 235, 235);
}
.rout-nav>span:hover {
    cursor: pointer;
    box-shadow: 11px 3px 10px 1px #e3e3e3;
    border-radius: 30px;
}
</style>