<template>
  <div class="xin-logo-view">
    <img class="xin-logo" src="../assets/logo.png" />
    <span class="line"></span>
    <img class="xin-logo-desc" src="../assets/logo-desc.svg" />
  </div>
</template>

<style lang="scss" scoped>
.xin-logo-view {
  display: inline-flex;
  align-items: center;
  height: 56px;
  .xin-logo {
    height: 24px;
  }
  .line {
    border-left: 1px solid #eaeaea99;
    height: 23px;
    margin: 0 20px;
  }
}

@media screen and (max-width: 768px) {
  .xin-logo-desc {
    display: none;
  }
}
</style>
