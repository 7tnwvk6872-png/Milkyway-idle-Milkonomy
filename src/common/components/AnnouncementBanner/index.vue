<script lang="ts" setup>
import { announcementConfig, dismissAnnouncement, shouldShowAnnouncement } from "@@/config/announcement"

const { t } = useI18n()

const visible = ref(shouldShowAnnouncement())

function handleClose() {
  dismissAnnouncement()
  visible.value = false
}
</script>

<template>
  <Transition name="announcement-slide">
    <div v-if="visible" class="announcement-banner">
      <div class="announcement-content">
        <div class="announcement-icon">
          🎉
        </div>
        <div class="announcement-text">
          <span class="announcement-title">{{ t(announcementConfig.message.title) }}</span>
          <span class="announcement-separator">—</span>
          <span class="announcement-message">{{ t(announcementConfig.message.content) }}</span>
          <a
            v-if="announcementConfig.link"
            :href="announcementConfig.link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="announcement-link"
          >
            <span class="link-icon">⭐</span>
            {{ announcementConfig.link.text }}
            <span class="link-arrow">→</span>
          </a>
        </div>
        <button class="announcement-close" :title="t('关闭')" @click="handleClose">
          ✕
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.announcement-banner {
  position: relative;
  z-index: 9999;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  padding: 10px 0;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  font-size: 14px;
  line-height: 1.5;
}

.announcement-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 48px 0 16px;
  position: relative;
}

.announcement-icon {
  font-size: 20px;
  flex-shrink: 0;
  animation: bounce 2s ease infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.announcement-text {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.announcement-title {
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.announcement-separator {
  opacity: 0.6;
}

.announcement-message {
  opacity: 0.95;
}

.announcement-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #ffffff;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.25s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  .link-icon {
    font-size: 14px;
  }

  .link-arrow {
    font-size: 14px;
    transition: transform 0.25s ease;
  }

  &:hover .link-arrow {
    transform: translateX(3px);
  }
}

.announcement-close {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #ffffff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;
  padding: 0;
  line-height: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }
}

// 响应式
@media (max-width: 768px) {
  .announcement-content {
    padding: 0 36px 0 12px;
    gap: 8px;
  }

  .announcement-text {
    font-size: 13px;
  }

  .announcement-separator {
    display: none;
  }

  .announcement-title {
    font-size: 13px;
  }
}

// 过渡动画
.announcement-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.announcement-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.announcement-slide-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.announcement-slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
