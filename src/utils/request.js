const baseUrl = import.meta.env.VITE_API_KEY;

function checkResponse(res) {
  if (!res.ok) {
    throw new Error(`Ошибка ${res.status}`);
  }
}

export default ({ endpoint, controller, callback }) => {
  const signal = controller.signal;
  fetch(baseUrl + endpoint, {
    signal,
  })
    .then((response) => {
      checkResponse(response);
      return response.json();
    })
    .then((response) => {
      callback(response.data);
    })
    .catch((e) => console.error(e));
};
