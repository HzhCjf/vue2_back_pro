// permissionDirective.js (自定义指令文件)
import user from './modules/user';

export default function button(el, binding) {
  const { value } = binding;
  const { buttons } = user.state;
  if (buttons.includes(value)) {
    // console.log('有权限看这个按钮');
  } else {
    // console.log('没有权限看这个按钮');
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }
}