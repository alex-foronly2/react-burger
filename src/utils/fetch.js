export default ({ url, controller, callback }) => {
  const signal = controller.signal;
  fetch(url, {
    signal,
  })
    .then((response) => response.json())
    .then((response) => {
      callback(response.data);
    })
    .catch((e) => console.error(e));
};
