import { $get, $post } from '@/utils/http'

const webeaseApi = {
  search: '/search',
  song: '/song/url',
  check: '/check/music',
  lyric: '/lyric',
}

export const search = (params = {}) => $get(webeaseApi.search, params)
export const song = (params = {}) => $get(webeaseApi.song, params)
export const check = (params = {}) => $get(webeaseApi.check, params)
export const lyric = (params = {}) => $get(webeaseApi.lyric, params)
