<template>
    <div class="rout-nav">
        <span class="home-link">
            <router-link to="/">
                <unicon name="house-user" fill="black" icon-style="monochrome"/>
            </router-link>
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
    margin-top: 10px;
    margin-left: 200px;
    position: fixed;
}
.rout-nav>span:hover {
    cursor: pointer;
    box-shadow: 11px 3px 10px 1px #e3e3e3;
    border-radius: 30px;
}
</style>