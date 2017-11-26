// Removing warning about requestAnimationFrame (https://github.com/facebookincubator/create-react-app/issues/3199#issuecomment-332842582)
(global as any).requestAnimationFrame = (cb: {}) => {
  setTimeout(cb, 0);
};