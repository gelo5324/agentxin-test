import { GetXinspace } from '@/utils/index'
import { GetFeiyongUrl, GetHrUrl, GetDubanUrl, GetErpUrl } from '@/api/workbench'
import Icon1 from '../images/icon1.png'
import Icon2 from '../images/icon2.png'
import Icon3 from '../images/icon3.png'
import Icon4 from '../images/icon4.png'
import Icon5 from '../images/icon5.png'
import Icon6 from '../images/icon6.png'
import Icon7 from '../images/icon7.png'
import Icon8 from '../images/icon8.png'
import Icon9 from '../images/icon9.png'
import Icon10 from '../images/icon10.png'
import Icon11 from '../images/icon11.svg'
import Icon12 from '../images/icon12.svg'
import Icon13 from '../images/icon13.svg'
import Icon14 from '../images/icon14.png'
import Icon15 from '../images/icon15.jpg'

export default {
    1: {
        id: "1",
        label: "OA系统",
        bg: "#008FFF",
        icon: Icon1,
        path: "https://oa.xinyuanfuwu.com/sys/portal/page.jsp",
    },
    2: {
        id: "2",
        label: "HR系统",
        bg: "#62BE5A",
        icon: Icon2,
        path: "https://oa.xinyuanfuwu.com/km/addin/ssoHRS.jsp",
        getUrlApi: GetHrUrl,
    },
    3: {
        id: "3",
        label: "费用系统",
        bg: "#F3AB3C",
        icon: Icon3,
        path: "https://oa.xinyuanfuwu.com/km/addin/ssoFeiYong.jsp",
        getUrlApi: GetFeiyongUrl,   
    },
    4: {
        id: '4',
        label: '督办系统',
        bg: '#FF414B',
        icon: Icon4,
        path: 'https://oa.xinyuanfuwu.com/km/addin/ssoDuBan.jsp',
        getUrlApi: GetDubanUrl,
        style: {

        }
    },
    5: {
        id: '5',
        label: '物管ERP',
        bg: '#3165F2',
        icon: Icon5,
        path: 'https://oa.xinyuanfuwu.com/km/addin/ssoWuGuan.jsp',
        getUrlApi: GetErpUrl,
        style: {
            // paddingLeft: '15px'
        }
    },
    6: {
        id: '6',
        label: '物管n9',
        bg: '#5AC5AC',
        icon: Icon6,
        path: 'http://server.xykjfw.net:8001/'
    },
    7: {
        id: '7',
        label: '学习中心',
        bg: '#F3AB3C',
        icon: Icon7,
        path: ''
    },
    8: {
        id: '8',
        label: '知识中心',
        bg: '#008FFF',
        icon: Icon8,
        path: 'https://oa.xinyuanfuwu.com/kms/knowledge/'
    },
    9: {
        id: '9',
        label: 'CRM系统',
        bg: '#5AC5AC',
        icon: Icon9,
        path: 'https://xinzhixiang.xinproptech.com#/noLogin?meta42code=',
        imgStyle: {

        }
    },
    10: {
        id: '10',
        label: '租售系统',
        bg: 'linear-gradient(#00BBFF, #0098FF)',
        icon: Icon10,
        path: 'https://rentsale.xinproptech.com/#/login?encryptedAccount=',
        style: {

        },
        class: 'rent-view',
        imgStyle: {

        }
    },
    11: {
        id: '11',
        label: '物管N9',
        bg: '#008FFF',
        icon: Icon11,
        path: 'http://server.xykjfw.net:8001',
        style: {

        },
        class: '',
        imgStyle: {

        }
    },
    12: {
        id: '12',
        label: '鑫空间',
        bg: '#008FFF',
        icon: Icon12,
        path: GetXinspace(),
        style: {

        },
        class: '',
        imgStyle: {

        }
    },
    13: {
        id: '13',
        label: '同程商旅',
        bg: '#F3AB3C',
        icon: Icon13,
        path: '',
        style: {

        },
        class: '',
        imgStyle: {
            marginTop: '2px',
            marginLeft: '3px'
        }
    },
    14: {
        id: '14',
        label: '鑫一家',
        bg: '#FFFFFF',
        icon: Icon14,
        path: 'https://manage.xinyuanfuwu.com',
        style: {
        },
        class: '',
        imgStyle: {
            height: '40px'
        }
    },
    15: {
        id: '15',
        label: '智慧停车',
        bg: '#FFFFFF',
        icon: Icon15,
        path: 'https://parking.xinyuanfuwu.com',
        style: {
        },
        class: '',
        imgStyle: {
            height: '40px'
        }
    },
}