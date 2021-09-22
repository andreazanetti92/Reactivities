import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/Activity";

const sleep = (delay: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  })
}

axios.defaults.baseURL = 'https://localhost:5001/api';

axios.interceptors.response.use(async res => {
  try {
    await sleep(1000);
    return res;
  } catch (err) {
    console.log(err);
    return await Promise.reject(err);
  }
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

