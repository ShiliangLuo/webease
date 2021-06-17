export function useDrag(el, movecallback, upcallback) {
  // 为el添加鼠标按下事件监听
  el.addEventListener('mousedown', mousedownHandler);

  let axisX = 0;
  let left = 0;
  let width = 0;

  // 鼠标按下
  function mousedownHandler(e) {
    axisX = e.clientX;
    width = parseFloat(e.target.parentNode.style.width);

    document.addEventListener('mousemove', mousemoveHandler);
    document.addEventListener('mouseup', mouseupHandler);
  }

  // 鼠标移动
  function mousemoveHandler(e) {
    let moveX = e.clientX;
    left = moveX - axisX + width;

    if (left <= 0) left = 0;

    movecallback(left);
  }

  // 鼠标松开
  function mouseupHandler(e) {
    document.removeEventListener('mousemove', mousemoveHandler);
    document.removeEventListener('mouseup', mouseupHandler);

    upcallback && upcallback();
  }
}
