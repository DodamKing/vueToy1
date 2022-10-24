<template>
    <div class="header">
        <div class="list text-right">
            <span><i class="fa-solid fa-stamp"></i> x 4 = 외출 1시간</span>
            <span>|</span>
            <span>1일 최대 6시간</span>
            <span>|</span>
            <span>1주일 최대 2일</span>
            <span>|</span>
            <span>이월 적립 가능</span>
        </div>
        <h3 class="text-center mt-3" @click="$router.go({path : '/'})">우리집</h3>
    </div>
</template>

<script>
export default {
    setup() {
        
    },
}
</script>

<style>
    .header {
        margin-top: 5px;
        padding: 0 15px;
    }

    .list {
        font-size: 8px;
    }

    .list span {
        padding: 2px;
    }
</style>