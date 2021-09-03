<!--
 * @Author: liuhl
 * @Date: 2021-09-02 16:35:29
 * @LastEditors: liuhl
 * @LastEditTime: 2021-09-03 19:22:36
 * @Description: file content
-->
<template>
  <div class="main">
    <div class="box">
      <div class="box-content">
        <div class="input_form">
          <div class="input_box m_border m_border_bottom pl0">
            <input type="number" placeholder="请输入手机号码" oninput="if(value.length > 11)value=value.slice(0,11)" v-model="phone" aria-required="true" />
            <a class="clear_btn" v-show="`${phone}`.length > 0" @click.stop="phone = ''"></a>
          </div>
          <p class="error-msg"></p>
          <div class="input_box m_border m_border_bottom pl0 msg">
            <input placeholder="请输入验证码" v-model="msgCode" oninput="if(value.length > 6)value=value.slice(0,6)" type="number" aria-required="true" />
            <span :class="{'send-code': true, 'send-active': `${this.phone}`.length > 10}" @click.stop="sendVerification">{{msgTxt}}</span>
          </div>
          <button class="confirm" @click.stop="confirm">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendMsg, verifyMsg } from '@/api/mgm'
import 'vant/lib/index.css'
import { Toast } from 'vant'
export default {
  name: 'mgmIndex',
  data () {
    return {
      phone: '',
      msgCode: '',
      isSend: false,
      timeNumber: 60,
      credential_id: '',
      msgTxt: '发送验证码'
    }
  },
  // computed: {
  //   timeNumber
  // },
  methods: {
    // 手机号校验，发送手机验证码
    sendVerification () {
      if (`${this.phone}`.length <= 10) {
        Toast({
          message: '请输入完整手机号码'
        })
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        Toast({
          message: '请输入正确的手机号'
        })
        return false
      }
      if (this.isSend) return
      this.isSend = true
      sendMsg({ mobile_phone: this.phone}).then(data => {
        this.secondsTime()
        Toast({
          message: '验证码发送成功'
        })
        this.credential_id = data.credential_id || ''
      }).catch(err => {
        this.isSend = false
        Toast({
          message: err.msg
        })
      })
    },
    // 倒计时
    secondsTime () {
      const time = setInterval(() => {
        this.timeNumber--
        this.msgTxt = `${this.timeNumber}s后重发`
        if (this.timeNumber <= 0) {
          this.timeNumber = 60
          this.isSend = false
          this.msgTxt = '发送验证码'
          clearInterval(time)
        }
      }, 1000)
    },
    // 确定按钮
    confirm () {
      if (!this.isSend) {
        Toast({
          message: '请先发送短信验证码'
        })
        return false
      }
      verifyMsg({
        credential_id: this.credential_id, // 凭据
        verification_code: this.msgCode // 验证码
      }).then(data => {
        // 验证码校验成功进行页面跳转
        // window.location.href = ''
        Toast({
          message: data.msg
        })
      }).catch(err => {
        Toast({
          message: err.msg
        })
      })
    }
  }
}
</script>

<style scoped>
body {
  font-size: 100px!important;
}
.main {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
}
.box {
  width: 100%;
  height: 100vh;
  background-image: url('../../assets/images/bg-img.png');
  background-size: 100% 100%;
}
.box-content {
  width: 100%;
  display: flex;
  justify-content: center;
}
.phone {
  padding: .6rem 0;
}
.msg {
  display: flex;
  padding-top: .57rem!important;
  padding-bottom: .57rem!important;
}
.msg input {
  width: 55%!important;
}
.send-code {
  flex: 1;
  width: 100%;
  border: 1px solid #999999;
  color: #999999;
  text-align: center;
  padding-top: .5rem;
  padding-bottom: .5rem;
  border-radius: 15px;
  letter-spacing: .12rem;
}
.send-active {
  border: 1px solid #003ab5;
  color: #003ab5;
}
.input_form {
  position: relative;
  background: #fff;
  padding: .2rem .6rem;
  transform: translateY(20rem);
  border-radius: .5rem;
}
.input_form .input_box {
  padding-right: 0;
}
.input_form .input_box.pl0 {
  padding-left: 0;
}
.input_form .input_box {
  position: relative;
  padding: 1rem 1rem 1rem 1.12rem;
  /* height: 5rem; */
}
.m_border {
  position: relative;
  border: none !important;
}
.input_form .input_box input{
    max-width: 90%;
}
.input_form .input_box input {
  /* font-size: 1.8rem; */
  font-weight: 500;
}
.input_form input {
  display: block;
  width: 100%;
  /* height: 3rem; */
  font-size: 1rem;
  /* padding: 0.1rem 1rem; */
  color: #333333;
  line-height: .8rem;
  border: none;
  outline: none;
  letter-spacing: .15rem;
  font-weight: normal;
}
input::-webkit-input-placeholder {
  color: rgb(221, 221, 221);
}
.input_form .clear_btn {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 50;
  margin-top: .8rem;
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADfklEQVRIS62XT2gTWRzHv79J0OySWlq7ra22RUgRxVPmDV0irAZBL+JBPCgoKnoRRQQ91WUXxN296Ek9VcUF2UUR1JOC0CCKtMxMe9BDa20hLZQWK9QE1zo1+S1vSMJkkk5eat8hDJnf+33e78/3vTcEhTE0NLQ5FAodYOZfiGgbEW1g5giAzwCmAbwBMJDL5R719vZ+VHAJCjIaGRlJ5PP535h5DxBsW/DjAPiXiK7ouv4+yHdV8PT09A+zs7M3iei4ItDP+MrMl4UQfxERV1tABXhwcHBTOBx+DEBXSVkNm4cAjgkh/vPblYEL0EEAG1cB6rogoteZTGZ3Mplc9PosgWV65+bmXq5SpGXrZuZ7hmEcrQo2TfMOEZ1YrUgrUkt0Vtf1m8X/3Yhl9+ZyuVf+Rmpra0NzczMmJibgOLJhg0dDQwO6u7sxNTWFTCbjN/6kaVpPPB7/4JZA/ti2/YyZ9/otW1tb0dnZ6ULHxsYC4RIai8VkTTE+Po5sNluxSiL6U9f1Sy64sDlMLCebjo4OtLe3B8K90MnJSSwsLCyXmrlsNrspmUx+I8uyLgC4GpTEIHgdUBehadqueDz+gkzTfEJE+2vVrxq8XmiB8bsQ4rKMeBxArBZYvvfCZ2Zm0NXV5da0Rnr90rpvGMYhsm07y8xRFbAXLp+ZuS5oYUN5oev6LhnxEoCwKlimt6enx410aWkJo6OjSlIr6ZdoSNf1nyX4E4B1KmBvTWXnNjU1KUnN53tACLFbguVZur0WuFojqUitit+/hRDHJfgfAIeDwEHduwL4RSHENQk+BaB/ObCKZOqBM3PcMIwRuXOtD4VCMwDW+OHRaLTUSLUkowJn5neGYWwp7dWWZd2VB7YfLHXa0tKiLJkiPJ1OY35+vloSzwkhrnsPiRgzvwWw1mutaRrC4XBdcolEIlhcLDvziy7TjuNsTSQSX0pg+WCaZh8R/VGru1f4Ps/M+wzDeFrSc/GBmeUu9gDAwRU6D5rWJy9+XoOyO5dlWT8S0XNmTqwi/LYQQiqnbFTcMlOpVCQajfYT0ZHvhOcB/OqPtCLVfoht22eYWda8cQULSDPzaW9Na0bsNRgeHv6Jmc8z80kAbQoLeAfghuM4t4rdu9ycwE+Y4qRUKhVubGzckc/ndzLzNk3TNgCIMHPp24mZB+SOpLA410QJrOqsHrv/AfXlwy68Cm4fAAAAAElFTkSuQmCC) no-repeat center;
  background-size: 100%;
}
.m_border_bottom:after {
  border-bottom-width: 1px;
  width: 100%;
  height: 1px;
  transform: scaleY(0.5);
  bottom: 0;
  left: 0;
  background:rgba(214, 215, 220, 0.6);
  transform-origin: 0 100%;
}
.m_border:after {
  content: '';
  position: absolute;
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: rgba(214, 215, 220, 0.4);
  pointer-events: none;
}
.confirm {
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1.6rem;
  padding: .6rem;
  font-size: 1.2rem;
  border: 0 solid #fff;
  color: #FFFFFF;
  letter-spacing: .25rem;
  background-color: #003AB5;
}
.confirm:active {
  background-color: #003094;
}
</style>