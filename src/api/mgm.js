/*
 * @Author: liuhl
 * @Date: 2021-09-03 11:15:29
 * @LastEditors: liuhl
 * @LastEditTime: 2021-09-03 17:41:13
 * @Description: file content
 */
import { post } from '@/utils/request'
import URLS from './urls'

// 发送短信验证码
export const sendMsg = options => post(URLS.sendMsg, {
  ...options
})

// 校验短信验证码
export const verifyMsg = options => post(URLS.verifyMsg, {
  ...options
})
