import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { Activity } from "../models/Activity";
import { store } from "../stores/store";

const sleep = (delay: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  })
}

axios.defaults.baseURL = 'https://localhost:5001/api';

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
  delete: (id: string) => requests.delete<void>(`/activities/${id}`)
}

const agent = {
  Activities
}

export default agent;

