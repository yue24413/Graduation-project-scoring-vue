<template>
  <div class="container">
    <div class="content">
      <div class="login-card">
        <form @submit.prevent="onLogin">
          <h2 class="title">login</h2>

          <label></label>
          <input
            type="text"
            id="number"
            v-model="userR.number"
            required
            placeholder="请输入学号/工号:" />
          <label></label>
          <input
            placeholder="请输入密码："
            type="password"
            id="password"
            v-model="userR.password"
            required />
          <button type="submit">Login</button>
        </form>
      </div>
      <div class="stars-container" ref="starsContainer">
        <div v-for="(star, index) in stars" :key="index" class="star" :style="star.style"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CommonService } from '@/services/index'
import { computed, onMounted, ref, watchEffect } from 'vue'
const starsContainer = ref(null)
const stars = ref([])
const userR = ref({ number: '', password: '' })

// 处理登录逻辑
const onLogin = async () => {
  const user = {
    number: userR.value.number,
    password: userR.value.password
  }
  await CommonService.loginService(user)
  userR.value.number = ''
  userR.value.password = ''
}
const getContainerSize = () => ({
  width: starsContainer.value?.clientWidth || 0,
  height: starsContainer.value?.clientHeight || 0
})

const containerSize = computed(() => getContainerSize())

const createStars = () => {
  const numStars = 150
  for (let i = 0; i < numStars; i++) {
    const star = {
      position: {
        x: Math.random() * containerSize.value.width,
        y: Math.random() * containerSize.value.height
      },
      direction: {
        x: (Math.random() > 0.5 ? -1 : 1) * (Math.random() / 10),
        y: (Math.random() > 0.5 ? -1 : 1) * (Math.random() / 10)
      },
      opacity: 1
    }
    stars.value.push(star)
  }
}

const animateStars = () => {
  if (!starsContainer.value) return
  stars.value.forEach((star) => {
    star.position.x += star.direction.x
    star.position.y += star.direction.y
    // 反弹或重新定位星星
    if (star.position.x < 0 || star.position.x > containerSize.value.width) {
      star.direction.x *= -1
    }
    if (star.position.y < 0 || star.position.y > containerSize.value.height) {
      star.direction.y *= -1
    }
    // 闪烁效果
    star.opacity = Math.random() > 0.9 ? 0 : 1
    // 更新星星的样式
    star.style = {
      left: `${star.position.x}px`,
      top: `${star.position.y}px`,
      opacity: star.opacity
    }
  })

  requestAnimationFrame(animateStars)
}

onMounted(() => {
  if (starsContainer.value) {
    createStars()
    animateStars()
  } else {
    console.warn('Stars container not available yet.')
  }
})

watchEffect(() => {
  if (
    containerSize.value.width !== getContainerSize().width ||
    containerSize.value.height !== getContainerSize().height
  ) {
    createStars()
  }
})
</script>

<style scoped>
.container {
  position: relative;
  height: 100vh;
  background-color: #000;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 40px;
  margin-bottom: 80px;
  z-index: 1; /* 确保标题在星星背景之上 */
}

.content {
  position: relative;
  width: 100%;
  height: calc(100% - 80px); /* 除去标题的高度 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-card {
  position: relative;

  background-color: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  padding: 80px 50px;
  border-radius: 8px;
  text-align: center;
  z-index: 1; /* 确保登录卡片在星星背景之上 */
}
.login-card label {
  display: block;
  margin-bottom: 10px;
}

.login-card input {
  margin-bottom: 15px;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px;
  background-color: rgba(0, 0, 0, 0);
  width: calc(100% - 10px);
  color: white;
  font-size: 1rem;
}
.login-card input:focus {
  border-bottom: 1px solid #007bff;
  outline: none;
}

.login-card button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.login-card button:hover {
  background-color: #0056b3;
}

.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* 星星背景层 */
  overflow: hidden;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background-color: white;
  border-radius: 50%;
}
@media (max-width: 1024px) {
}
</style>
