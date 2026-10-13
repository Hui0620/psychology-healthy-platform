<script setup>
import { logout,get} from '@/net'
import router from "@/router";
import {useStore} from "@/store";
import {useDark} from "@vueuse/core";
import {ref} from "vue";
import {
  ArrowRightBold, Aim, UserFilled, ZoomIn, Moon, Sunny, Document
} from "@element-plus/icons-vue";

const store = useStore();
const dark=ref(useDark())
const loading= ref(false);

// 设置默认用户信息为心理中心老师
store.user = {
  id: 2,
  username: '心理中心老师',
  role: 'counselor'
}

function userLogout() {
  logout(() => router.push("/"))
}
</script>

<template>
  <div class="main-content" v-loading="loading" element-loading-text="加载中，请稍等...">
    <el-container style="height: 100%" v-if="!loading">
      <el-header class="main-content-header">
        <el-row>
          <el-col :span="20" style="align-content: center;display: flex;justify-content: left">
            <div style="align-content: center">
              <el-image class="logo" src="src/assets/logo.svg"/>
            </div>
            <div style="width: 70%;align-content: center;margin-left: 15px;font-size: 23px">
              大学生心理健康家校医一体化平台 - 心理中心
            </div>
          </el-col>
          <el-col :span="4" style="align-content: center">
            <div  class="user-info">
              <el-switch style="margin: 0 20px"
                         v-model="dark" active-color="#424242"
                         :active-action-icon="Moon"
                         :inactive-action-icon="Sunny"/>
              <el-button @click="userLogout" divided>
                <el-icon><ArrowRightBold /></el-icon>
                退出系统
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="230px">
          <el-scrollbar style="height: calc(100vh - 55px)">
            <el-menu
                router
                :default-active="$route.path"
                style="min-height: calc(100vh - 55px)"
                :default-openeds="['1','2','3']"
            >
              <el-sub-menu index="1">
                <template #title>
                  <el-icon><UserFilled /></el-icon>
                  <span><b>学生档案</b></span>
                </template>
                <el-menu-item index="/counselor">
                  <template #title>
                    <el-icon><ZoomIn /></el-icon>
                    历史档案
                  </template>
                </el-menu-item>
                <el-menu-item index="/counselor/new-medical">
                  <template #title>
                    <el-icon><ZoomIn /></el-icon>
                    新增档案
                  </template>
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title>
                  <el-icon><Aim /></el-icon>
                  <span><b>心理评估</b></span>
                </template>
                <el-menu-item index="/counselor/user-profile">
                  <template #title>
                    <el-icon><UserFilled /></el-icon>
                    学生画像
                  </template>
                </el-menu-item>
                <el-menu-item index="/counselor/diagnosis">
                  <template #title>
                    <el-icon><ZoomIn /></el-icon>
                    辅助诊断
                  </template>
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="3">
                <template #title>
                  <el-icon><Document /></el-icon>
                  <span><b>转诊管理</b></span>
                </template>
                <el-menu-item index="/counselor/referral">
                  <template #title>
                    <el-icon><Document /></el-icon>
                    转诊建议
                  </template>
                </el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main class="main-content-page">
          <el-scrollbar style="height: calc(100vh - 55px)">
            <router-view v-slot="{ Component}">
              <transition name="el-fade-in-linear" mode="out-in">
                <component :is="Component" style="height: 100%"></component>
              </transition>
            </router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.main-content-page{
  padding: 0;
  background-color: #f5f7fa;
}
.dark .main-content-page{
  background-color: #1f2023;
}

.main-content{
  height: 100vh;
  width: 100vw;
}
.main-content-header{
  border-bottom: 1px solid #e4e7ed;
  height: 55px;
  background-color: #ffffff;
  .logo{
    height: 38px;
  }
  .user-info{
    height: 55px;
    text-align: right;
    font-size: 20px;
    margin-right: 20px;
    align-content: center;

    .el-avatar:hover{
      cursor: pointer;
    }
  }
}
</style> 