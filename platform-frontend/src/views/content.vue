<script setup>
import {useStore} from "@/store/index.js";

const store = useStore().user.role;
</script>

<template>
  <div class="content">
    <div class="main-body">
      <div style="margin: 0;">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content{
  background-color: #f5f7fa;
  width: 100%;
  height: 100%;
}
.main-body{
  width: 100%;
  height: 100%;
  background-color: transparent;
}
.dark .content{
  background-color: #1f2023;
}
</style>