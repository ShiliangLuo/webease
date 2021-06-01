import { $get, $post } from '@/utils/http';

const webeaseApi = {
  search: '/search',
  test: '/about',
};

export const search = (params = {}) => $get(webeaseApi.search, params);
export const test = (params = {}) => $get(webeaseApi.test, params);
