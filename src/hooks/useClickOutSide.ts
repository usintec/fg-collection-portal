import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export default function useDetectOutsideClick(component: Ref<any>, callback: () => void) {
  if (!component) return
  const listener = (event: MouseEvent) => {
    if (event.target !== component.value && event.composedPath().includes(component.value)) {
      return
    }
    if (typeof callback === 'function') {
      callback()
    }
  }
  onMounted(() => {
    window.addEventListener('click', listener)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('click', listener)
  })

  return { listener }
}
