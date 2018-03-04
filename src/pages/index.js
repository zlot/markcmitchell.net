import withSmoothScroll from './withSmoothScroll'
import Experimental from './Experimental'
import Works from './Works/index'

const ExperimentalWithSmoothScroll = withSmoothScroll(Experimental)
const WorksWithSmoothScroll = withSmoothScroll(Works)

export {
  ExperimentalWithSmoothScroll,
  WorksWithSmoothScroll
}