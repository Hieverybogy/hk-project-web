import type { Dept } from "@/types/index";
import request from "@/utils/axios/index";

// export const fetchShopPageData = (params: Dept.Params) => {
//   return axios.post("/users/login", params, { showLoading: false });
// };

export const fetchShopPageData = (data: Dept.Params) => {
  return request.post({ url: '/mock/user/login', data: data })
};

export const aaaaaa = (params: Dept.Params) => {
  return request.get({ url: '/aaa/aaaaaa', params });
};

export const bbb = (params: Dept.Params) => {
  return request.get({ url: '/aaa/bbb', params });
};
