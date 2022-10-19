<template>
    <div id="test">
        <h2>This is Test Page</h2>
        <!-- <div>{{ data }}</div> -->
    </div>
</template>

<script>
export default {
    created() {
        this.$http.get('/api/test')
        .then((response) => {
            console.log(response);
        })
    },
}
</script>