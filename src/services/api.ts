import axios from "axios";

const api = axios.create({
  baseURL: "",          // importante: vazio
  // withCredentials: true, // não é necessário com proxy (mas pode deixar, não atrapalha)
});

export default api;
