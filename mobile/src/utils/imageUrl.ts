import { API_BASE_URL } from '../constants/config';

export const resolveImageUrl = (url: string) => {
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};
