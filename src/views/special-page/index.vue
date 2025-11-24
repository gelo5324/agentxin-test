<template>
    <div class="news-special-view">
        <div class="news-special-view-top">

        </div>
        <div class="news-special-view-content">
            <div>
                <div class="news-special-card">
                    <div class="news-special-title">
                        <span class="more">更多<el-icon><ArrowRight /></el-icon></span>
                    </div>
                    <el-tabs class="news-special-tabs">
                        <el-tab-pane label="test"></el-tab-pane>
                    </el-tabs>
                    <div class="news-scrollbar">
                        <el-scrollbar>
                        
                        </el-scrollbar>
                    </div>
                </div>
                <div class="news-special-card">
                    <div class="news-special-title">
                        <span class="more">更多<el-icon><ArrowRight /></el-icon></span>
                    </div>
                    <el-tabs class="news-special-tabs">
                        <el-tab-pane label="test"></el-tab-pane>
                    </el-tabs>
                    <div class="news-scrollbar">
                        <el-scrollbar>
                        
                        </el-scrollbar>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.news-special-view {
    &-top {
        height: 230px;
        background-color: #f5f5f5;
    }
    &-content {
        padding: 20px 80px;
        & > div {
            display: flex;
            column-gap: 20px;
        }
        & > div + div {
            margin-top: 20px;
        }
    }
    .news-special-card {
        background-color: #fff;
        border-radius: 2px;
        display: flex;
        flex-direction: column;
        border: 1px solid #ebedf0;
        flex: 1;
        position: relative;
    }
    .news-special-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #eef1f5;
        padding: 9px 20px;
        border-bottom: 1px solid #e7e7e7;
        position: absolute;
        top: 5px;
        right: 0px;
        z-index: 1;
        border-bottom-width: 0;
        .more {
            cursor: pointer;
            font-size: 12px;
            font-weight: 400;
            color: $base-color-primary;
            display: flex;
            align-items: center;
            line-height: 12px;
        }
    }
    :deep(.news-special-tabs) {
        --el-tabs-header-height: 38px;
        --el-border-color-light: #e7e7e7;
        .el-tabs__header {
            background: #eef1f5;
            padding: 0 20px;
            border-bottom: 1px solid #e7e7e7;
        }
        .el-tabs__nav-wrap:after {
            height: 1px;
        }
        .el-tabs__item {
            font-size: 16px;
            font-weight: 600;
        }
    }
    .news-scrollbar {
        // flex: 1;
        // position: relative;
        height: 300px;
        & > div {
            // position: absolute;
            // top: 0;
            // left: 0;
            width: 100%;
            height: 100%;
            padding: 0 20px 15px 20px;
        }
    }
}
</style>