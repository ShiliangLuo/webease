export function useDrag(
  el: HTMLElement,
  movecallback: (v: number) => void,
  upcallback?: () => void,
) {
  // 为el添加鼠标按下事件监听
  el.addEventListener('mousedown', mousedownHandler)

  let axisX = 0
  let left = 0
  let width = 0

  // 鼠标按下
  function mousedownHandler(e: MouseEvent) {
    const target = e.target as HTMLElement
    const parentNode = target.parentNode as HTMLElement

    axisX = e.clientX
    width = parseFloat(parentNode.style.width)

    document.addEventListener('mousemove', mousemoveHandler)
    document.addEventListener('mouseup', mouseupHandler)
  }

  // 鼠标移动
  function mousemoveHandler(e: MouseEvent) {
    let moveX = e.clientX
    left = moveX - axisX + width

    if (left <= 0) return movecallback(0)

    movecallback(left)
  }

  // 鼠标松开
  function mouseupHandler() {
    document.removeEventListener('mousemove', mousemoveHandler)
    document.removeEventListener('mouseup', mouseupHandler)

    upcallback && upcallback()
  }
}
