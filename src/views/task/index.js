import { isMobile } from '@/utils/index'

import Task from './index.vue'
import TaskMobile from './index.mobile.vue'

const TaskView = isMobile?TaskMobile:Task

export default TaskView;