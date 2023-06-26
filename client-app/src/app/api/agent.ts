import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { Activity } from "../models/Activity";
import { User, UserFormValues } from "../models/User";
import { store } from "../stores/store";

const sleep = (delay: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  })
}

axios.defaults.baseURL = 'https://localhost:5001/api';

axios.interceptors.request.use(config => {
  const token = store.commonStore.token;
  if(token) config.headers.Authorization = `Bearer ${token}`

  return config;
})

axios.interceptors.response.use(async res => {
    await sleep(1000);
    return res;
}, (err: AxiosError) => {
  const {data, status, config} = err.response!;
  switch (status) {
    case 400:
      if(typeof data === 'string'){
        toast.error(data);
      }
      if(config.method === 'get' && data.errors.hasOwnProperty('id')){
        history.push('/not-found');
      }
      if(data.errors){
        const modalStateErrors = [];
        for(const key in data.errors){
          if(data.errors[key]){
            modalStateErrors.push(data.errors[key])
          }
        }
        throw modalStateErrors.flat();
      }
      break;
    case 401:
      toast.error('Unauthorised')
      break;
    case 404:
      history.push('/not-found')
      break;
    case 500:
      store.commonStore.setServerError(data);
      history.push('/server-error');
      break;
    default:
      break;
  }

  return Promise.reject(err);
})

const responseBoby = <T> (res: AxiosResponse<T>) => res.data;

// Abstraction
const requests = {
  get:<T> (path: string) => axios.get<T>(path).then(responseBoby),
  post:<T> (path: string, data: {}) => axios.post<T>(path, data).then(responseBoby),
  put: <T> (path: string, data: {}) => axios.put<T>(path, data).then(responseBoby),
  delete: <T> (path: string) => axios.delete<T>(path).then(responseBoby),
}

const Activities = {
  list: () => requests.get<Activity[]>('/activities'),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => requests.post<void>('/activities', activity),
  update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete<void>(`/activities/${id}`),
  attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
}

const Account = {
  current: () => requests.get<User>('/account'),
  login: (user: UserFormValues) => requests.post<User>('/account/login', user),
  register: (user: UserFormValues) => requests.post<User>('/account/register', user),
}

const agent = {
  Activities,
  Account
}

export default agent;

