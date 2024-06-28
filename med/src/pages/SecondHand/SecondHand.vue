<template>
    <div>
        <iframe class="iframe" src="https://tsaiii0109.github.io/nchu-secondHand/" frameborder="0"></iframe>
        <div class="footer" @click="$router.replace('/more')"><i class="fa-solid fa-arrow-left left"></i> Back</div>
    </div>
</template>

<script>
export default {
    name:'SecondHand',
}
</script>

<style scoped>
    .iframe{
        width: 100%;
        height: calc(100vh - 60px);
    }
    .left{
        margin-right: 5px;
    }
    .footer{
        width: 100%;
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
        font-size: 18px;
    }
</style>