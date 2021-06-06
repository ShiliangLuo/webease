import { $get, $post } from '@/utils/http';

const webeaseApi = {
  search: '/search',
  song: '/song/url',
  check: '/check/music',
};

export const search = (params = {}) => $get(webeaseApi.search, params);
export const song = (params = {}) => $get(webeaseApi.song, params);
export const check = (params = {}) => $get(webeaseApi.check, params);
