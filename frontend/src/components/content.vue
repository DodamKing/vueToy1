<template>
    <div class="content">
        <div class="black-bg" v-if="alert_modal">
            <div class="white-bg">
                <h4>{{alert_title}}</h4>
                <p v-html="alert_msg"></p>
                <div class="d-flex flex-row-reverse">
                    <div class="btn btn-secondary" @click="closeModal()">확인</div>
                </div>
            </div>
        </div>
        <div class="sub text-right mr-3">
            <div class="btn btn-info" @click="$router.push({path : '/history'})">조회</div>
        </div>
        <div class="group">  
            <div class="stamp">0.5 개</div>
            <div class="mt-2">
                <div class="btn btn-sm btn-outline-info mt-1 mr-1" @click="activeToggle($event)" v-for="(list, i) in state.list.half" :key="i">{{list}}</div>
            </div>
        </div>
        <div class="group">  
            <div class="stamp">1 개</div>
            <div class="mt-2">
                <div class="btn btn-sm btn-outline-info mt-1 mr-1" @click="activeToggle($event)" v-for="(list, i) in state.list.one" :key="i">{{list}}</div>
            </div>
        </div>
        <div class="group">  
            <div class="stamp">2 개</div>
            <div class="mt-2">
                <div class="btn btn-sm btn-outline-info mt-1 mr-1" @click="activeToggle($event)" v-for="(list, i) in state.list.two" :key="i">{{list}}</div>
            </div>
        </div>
        <div class="group">  
            <div class="stamp">3 개</div>
            <div class="mt-2">
                <div class="btn btn-sm btn-outline-info mt-1 mr-1" @click="activeToggle($event)" v-for="(list, i) in state.list.three" :key="i">{{list}}</div>
            </div>
        </div>
        <div class="group mb-5">  
            <div class="stamp">4 개</div>
            <div class="mt-2">
                <div class="btn btn-sm btn-outline-info mt-1 mr-1" @click="activeToggle($event)" v-for="(list, i) in state.list.four" :key="i">{{list}}</div>
            </div> 
        </div>

        <div class="input_group">
            <div class="name text-center">
                <div class="form-check-inline">
                    <label class="form-check-label">
                        <input type="radio" class="form-check-input" name="optradio" value="서연" v-model="input_name">서연
                    </label>
                </div>
                <div class="form-check-inline"></div><div class="form-check-inline"></div><div class="form-check-inline"></div>
                <div class="form-check-inline"></div><div class="form-check-inline"></div><div class="form-check-inline"></div>
                <div class="form-check-inline"></div><div class="form-check-inline"></div><div class="form-check-inline"></div>
                <div class="form-check-inline">
                    <label class="form-check-label">
                        <input type="radio" class="form-check-input" name="optradio" value="도담" v-model="input_name">도담
                    </label>
                </div>
            </div>
            <div class="mt-3">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span id="userName" class="input-group-text" v-if="input_name">{{input_name}}</span>
                        <span id="userName" class="input-group-text" v-if="!input_name">Person</span>
                    </div>
                    <input v-model="input_date" type="text" class="form-control" placeholder="날짜">
                    <input v-model="input_hour" type="text" class="form-control" placeholder="시간">
                </div>
            </div>
            <div class="sub text-center mt-4">
                <div class="btn btn-primary" @click="add()">등록</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {reactive} from 'vue'
import AlertModal from './alertModal.vue'

export default {
    setup() {
        const state = reactive({
            list : {},
        })
        
        axios.get('/api/list').then((res) => {
            state.list = res.data
        })

        async function add () {
            const name = this.input_name
            if (!name) {
                this.alert_title = '당신은 누구십니까?'
                this.alert_msg = '이름을 선택해 주세요'
                this.alert_modal = true
                document.body.style = 'overflow:hidden'
                return
            }

            const works = []
            const stamps = []
            let stamp = 0
            const actives = document.querySelectorAll('.btn-outline-info.active')
            for (const active of actives) {
                works.push(active.innerHTML)
                stamps.push(parseFloat(active.parentElement.parentElement.childNodes[0].innerHTML.replace('개', '').trim()))
            }
            
            const res = await axios.post('/api/save', {name, date : this.input_date, hour : this.input_hour, works, stamp, stamps})
            
            const data = res.data
            this.alert_title = '정상 등록 되었습니다.'
            this.alert_msg = `도장 ${data.stamp} 개,<br>사용가능 시간 ${data.time}시간<br>남았습니다.`
            this.alert_modal = true
            document.body.style = 'overflow:hidden'
            // location.reload()
        }

        function closeModal() {
            this.alert_modal = false
            document.body.style = 'overflow:auto'
        }

        function activeToggle(e) {
            const target = e.target.classList
            if (target.contains('active')) {
                target.remove('active')
            } 
            else {
                target.add('active')
            }
        }

        return {state, add, closeModal, activeToggle}
    },

    data() {
        return {
            input_date : '',
            input_hour : '',
            input_name : '',
            alert_modal : false,
            alert_title : '',
            alert_msg : '',
        }
    },

    components : {
        AlertModal,
    },
}
</script>

<style scoped>
    .content {
        padding: 20px 5px;
        background: #D8D9CF;
        margin: 20px;
        border-radius: 10px;
    }

    .group {
        margin: 10px;
        padding: 10px;
        background: #EDEDED;
        border-radius: 10px;
        color: black;
    }

    .btn-outline-info:hover {
        background: none;
        color: #17A2b8;
    }

    .input_group {
        border-top: 1px solid;
        padding-top: 20px;
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
    
</style>