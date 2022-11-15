<template>
    <div class="history">
        <div class="black-bg" v-if="alert_modal">
            <div class="white-bg">
                <h4>{{alert_title}}</h4>
                <p v-html="alert_msg"></p>
                <div class="d-flex flex-row-reverse">
                    <div class="btn btn-secondary ml-1" @click="closeModal()">취소</div>
                    <div class="btn btn-danger mr-1" @click="del()">확인</div>
                </div>
            </div>
        </div>
        <div class="black-bg" v-if="msg_modal">
            <div class="white-bg">
                <h4>{{title}}</h4>
                <p v-html="msg"></p>
                <div class="d-flex flex-row-reverse">
                    <div class="btn btn-secondary ml-1" @click="msgClose()">확인</div>
                </div>
            </div>
        </div>

        <div class="btn btn-info ml-1" @click="$router.push({path : '/'})">
            <i class="fa-solid fa-angles-left"></i>
        </div>
        <div class="info text-center mt-3">
            <div class="row">
                <div class="col">서연</div>
                <div class="col">{{state.stamp[0].cnt}} 개</div>
                <div class="col">{{state.stamp[0].time}} 시간</div>
            </div>
            <div class="row">
                <div class="col">도담</div>
                <div class="col">{{state.stamp[1].cnt}} 개</div>
                <div class="col">{{state.stamp[1].time}} 시간</div>
            </div>
        </div>
        <div class="text-center mb-3 mt-3">
            <div class="custom-control custom-radio custom-control-inline mr-5">
                <input type="radio" class="custom-control-input" id="customRadio" name="example" value="s" v-model="name">
                <label class="custom-control-label" for="customRadio">서연</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline ml-5">
                <input type="radio" class="custom-control-input" id="customRadio2" name="example" value="d" v-model="name">
                <label class="custom-control-label" for="customRadio2">도담</label>
            </div>
        </div>
        <div class="input-group mb-3 pr-2 pl-2">
            <!-- <input type="text" class="form-control" placeholder="사용시간" v-model="time"> -->
            <select class="custom-select" v-model="time">
                <option value="">사용시간</option>
                <option value="1">1시간</option>
                <option value="2">2시간</option>
                <option value="3">3시간</option>
                <option value="4">4시간</option>
                <option value="5">5시간</option>
                <option value="6">6시간</option>
            </select>
            <div class="input-group-append">
                <button class="btn btn-success" @click="use()">사용하기</button>
            </div>
        </div>
        <div class="line"></div>
        <div class="mt-3">
            <div class="d-flex flex-row-reverse mr-2 mb-3">
                <button class="btn btn-danger" @click="modal()" :disabled="selected === ''">삭제하기</button>
            </div>
            <div class="historys">
                <div v-for="(h, i) in state.history" :key="i">
                    <div class="row cont text-center" @click="selected = h.idx" :class="{select : selected === h.idx}">
                        <div class="col">{{h.name}}</div>
                        <div class="col-2">{{h.date}}</div>
                        <div class="col">{{h.hour}}</div>
                        <div class="col">{{h.work}}</div>
                        <!-- <div class="flex-fill" style="font-size: 8px;">{{h.record}}</div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {reactive} from 'vue'

export default {
    setup() {
        const state = reactive({
            history : '',
            stamp : [{cnt : '', time : ''}, {cnt : '', time : ''}],
        })
        axios.get('/api/history').then((res) => {
            state.history = [...res.data.history].reverse()
            state.stamp = res.data.stamp
        })

        async function use() {
            const name = this.name
            const time = this.time
            if (!name)  {
                document.body.style = 'overflow:hidden'
                this.title = '누구십니까?'
                this.msg = '이름을 선택해 주세요.'
                return this.msg_modal = true
            }
            if (!time)  {
                document.body.style = 'overflow:hidden'
                this.title = '사용시간이 없습니다.'
                this.msg = '시간을 입력하세요.'
                return this.msg_modal = true
            }
            
            const idx = 0 ? name === 's' : 1
            if (state.stamp[idx].time < parseInt(time)) {
                document.body.style = 'overflow:hidden'
                this.title = '가불은 안됩니다.'
                this.msg = '시간을 다시 입력해 주세요.'
                return this.msg_modal = true
            }

            const res = await axios.post('/api/history/use', {name, time})
            state.history = [...res.data.history].reverse()
            state.stamp = res.data.stamp
            this.time = ''
            this.name = ''
        }

        async function del() {
            const idx = this.selected
            const res = await axios.get('/api/history/delete/' + idx)

            state.history = [...res.data.history].reverse()
            state.stamp = res.data.stamp
            this.selected = ''
            this.closeModal()
        }

        function modal() {
            this.alert_title = 'Alert'
            this.alert_msg = '선택된 항목을 삭제 하시겠습니까?'
            this.alert_modal = true
            document.body.style = 'overflow:hidden'
        }

        function closeModal() {
            this.alert_modal = false
            document.body.style = 'overflow:auto'
        }

        function msgClose() {
            this.msg_modal = false
            document.body.style = 'overflow:auto'
        }

        return {state, use, modal, closeModal, del, msgClose}
    },

    data() {
        return {
            alert_modal : false,
            msg_modal : false,
            selected : '',
            name : '',
            time : '',
            title : '',
        }
    }
}
</script>

<style scoped>
    .history {
        background: #D8D9CF;
        margin: 10px;
        border-radius: 10px;
        padding: 20px;
    }

    .cont {
        background: #EDEDED;
        padding: 10px 0;
        margin: 15px 5px;
        color: #17A2b8;
        font-size: 12px;
        border-radius: 10px;
    }

    .info {
        background: #999;
        margin: 5px;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
    }

    .line {
        border: 2px solid;
    }

    .black-bg {
        width: 100%; height:100%;
        background: rgba(0,0,0,0.5);
        position: fixed; padding: 20px;
        left: 0; top: 0;
        z-index: 10;
    }
    .white-bg {
        width: 90%; background: white;
        border-radius: 8px;
        padding: 20px;
        color: black;
        position: fixed;
        bottom: 20px;
        left: 5%;
    }

    .select {
        border: 2px solid;
    }

    .cont .col {
        padding: 0px;
    }

    .historys {
        height: 350px;
        overflow: auto;
    }
</style>