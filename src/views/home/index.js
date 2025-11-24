import { isMobile } from '@/utils/index'

import Home from '@/views/home/index.vue'
import Workbench from '@/views/workbench/index.vue'

const HomeView = isMobile?Home:Workbench

export default HomeView;