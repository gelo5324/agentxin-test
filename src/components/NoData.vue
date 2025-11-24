<template>
    <div class="no-data-view">
        <img class="no-data-img" src="../assets/no-data.svg" />
        <div class="no-data-text">暂无数据</div>
    </div>
</template>

<style lang="scss" scoped>
.no-data-view {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .no-data-img {
        width: 60px;
        margin-bottom: 15px;
        margin-left: 8px;
    }
    .no-data-text {
        color: $base-color-9;
        font-size: 14px;
    }
}
@media screen and (max-height: 800px) {
    .no-data-view {
        .no-data-img {
            width: 50px;
            margin-left: 6px;
        }
        .no-data-text {
            font-size: 12px;
        }
    }
}
</style>