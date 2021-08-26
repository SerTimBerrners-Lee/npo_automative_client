<template>
    <div>
        <HeadersNav />
        <MenuItem />
        <NavigationPanel />
        <WorkTable />
    </div>
</template>


<script>

import MenuItem from '@/components/menu-left';
import HeadersNav from '@/components/header-nav';
import NavigationPanel from '@/components/navigation-panel';
import WorkTable from './WorkTable.vue'

export default {
    
    components: {
        MenuItem,
        HeadersNav,
        NavigationPanel,
        WorkTable
    }
}
</script>


<style>

</style>