import withSmoothScroll from './withSmoothScroll'
import Experimental from './Experimental'
import Works from './Works'

const ExperimentalWithSmoothScroll = withSmoothScroll(Experimental, 'Experimental')
const WorksWithSmoothScroll = withSmoothScroll(Works, 'Works')

export {
  ExperimentalWithSmoothScroll,
  WorksWithSmoothScroll
}