import Vue from 'vue'
import Router from 'vue-router'
import LeaderBoard from '@/views/leaderboard/leaderBoard.vue'
import RealName from '@/views/RealName/RealName.vue'
import EnterTraining from '@/views/EnterTraining/EnterTraining.vue'
import TrainingFile from '@/views/TrainingFile/TrainingFile.vue'
import PersonnelManagement from '@/views/PersonnelManagement/PersonnelManagement.vue'
import FaceRecognition from '@/views/FaceRecognition/FaceRecognition.vue'
import RecognitionResult from '@/views/RecognitionResult/RecognitionResult.vue'
import Training from '@/views/Training/Training.vue'
import Addpeople from '@/views/Addpeople/Addpeople.vue'
import IDcareResult from '@/views/IDcareResult/IDcareResult.vue'
import SoftList from '@/views/SoftList/SoftList.vue'
import SystemHelp from '@/views/SystemHelp/SystemHelp.vue'
import VideoHelp from '@/views/SystemHelp/components/Video.vue'
import DocumentHelp from '@/views/SystemHelp/components/Document.vue'
import TechnicalHelp from '@/views/SystemHelp/components/Technical.vue'
import Login from '@/views/Login/Login.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/home',
            name: 'index',
            component: require('@/views/index').default
        },
        {
            path: '/SoftList',
            name: 'SoftList',
            component: SoftList
        },
        {
            path: '/leaderBoard',
            name: 'leader-board',
            component: LeaderBoard
        },
        {
            path: '/RealName',
            name: 'RealName',
            component: RealName
        },
        {
            path: '/TrainingFile',
            name: 'TrainingFile',
            component: TrainingFile
        },
        {
            path: '/PersonnelManagement',
            name: 'PersonnelManagement',
            component: PersonnelManagement
        },
        {
            path: '/EnterTraining',
            name: 'EnterTraining',
            component: EnterTraining
        },
        {
            path: '/FaceRecognition',
            name: 'FaceRecognition',
            component: FaceRecognition
        },
        {
            path: '/RecognitionResult',
            name: 'RecognitionResult',
            component: RecognitionResult
        },
        {
            path: '/Training',
            name: 'Training',
            component: Training
        },
        {
            path: '/Addpeople',
            name: 'Addpeople',
            component: Addpeople
        },
        {
            path: '/IDcareResult',
            name: 'IDcareResult',
            component: IDcareResult
        },
        {
            path: '/VideoHelp',
            name: 'VideoHelp',
            component: VideoHelp
        },
        {
            path: '/DocumentHelp',
            name: 'DocumentHelp',
            component: DocumentHelp
        },
        {
            path: '/SystemHelp',
            name: 'SystemHelp',
            component: SystemHelp
        },
        {
            path: '/TechnicalHelp',
            name: 'TechnicalHelp',
            component: TechnicalHelp
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.name === 'Login') {
        next()
        return
    }

    if (window.sessionStorage.getItem('loginStatus') === '1') {
        next()
        return
    }

    next({
        name: 'Login'
    })
})

export default router
