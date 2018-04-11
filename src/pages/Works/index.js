import React from 'react'
import img1 from './SydneyInteractiveArtsMeetup/1-.jpg'
import img2 from './SydneyInteractiveArtsMeetup/2.jpg'
import img3 from './SydneyInteractiveArtsMeetup/3.jpg'
import img4 from './SydneyInteractiveArtsMeetup/4.jpg'
import test from './SydneyInteractiveArtsMeetup/test.jpg'
import test2 from './SydneyInteractiveArtsMeetup/test2.jpg'
import test23 from './SydneyInteractiveArtsMeetup/test23.jpg'
import test3 from './SydneyInteractiveArtsMeetup/test3.jpg'
import test4 from './SydneyInteractiveArtsMeetup/test4.jpg'
import test5 from './SydneyInteractiveArtsMeetup/test5.png'
import test6 from './SydneyInteractiveArtsMeetup/test6.jpg'
import test7 from './SydneyInteractiveArtsMeetup/test7.png'
import test8 from './SydneyInteractiveArtsMeetup/test8.jpg'
import test9 from './SydneyInteractiveArtsMeetup/test9.jpg'
import test10 from './SydneyInteractiveArtsMeetup/test10.jpg'
import test11 from './SydneyInteractiveArtsMeetup/test11.jpg'
import _ from './SydneyInteractiveArtsMeetup/_.jpg'
import Rellax from 'rellax'

const WorkExample = () => (
  <article className='WorkDetail'>
    <div className='Work__description'>
      <h1>Sydney Interactive Arts Meetup</h1>
      <p>I co-founded the Sydney Interactive Arts Meetup to create a community where professionals, industry, and hobbyists can get together to discuss and collaborate on all things related to interactive art.</p>
      <p>Emila and myself have fostered a community to share ideas and projects, find collaborators, and get feedback and support from active and passionate members.</p>
      <p>The meetup welcomes creatives, makers, developers, artists, designers, musicians, creative coders, anyone interested in the intersection of art and technology.</p>
      <p>Previous speakers have included Mat Tizard from The Zoo (Google), Code on Canvas, and S1T2.</p>
    </div>
    <img src={img1} />
    <img src={img2} />
    <img src={img3} />
    <img src={img4} />
  </article>
)

export default class Works extends React.Component {

  componentDidMount = () => {
    const rellax = new Rellax('.rellax', {
      center: true,
      speed: -0.25
    })
  }
  render = () => (
    <div className='Works container'>
      {/* <ul> 
        <li>How Ethical Are You? Fjord Trends 2018 Installation</li>
        <li>EXP 1: FIIRE</li>
        <li>Vivid Sydney 2018 Proposal</li>
        <li>Fjord Vibe</li>
        <li>CP-ARMY Experience Prototype</li>
        <li>Sydney Interactive Arts Meetup</li>
        <li>Large Scale Interastive Wall For UTS</li>
        <li>Monster World—Vivid Sydney</li>
        <li>United Overseas Bank Painting of the Year—ReImagined</li>
        <li>Pensivity—Beams Arts Festival</li>
        <li>Graffiti Me—Vivid Sydney</li>
        <li>The Creators</li>
        <li>Designing 4 Mobile Interaction w/ Augmented Objects</li>
        <li>The Cycle Shift—Concept</li>
      </ul> */}
      <div className="row">
        <div className='col-xs-12 col-md-5 col-md-offset-1'>
          <div className='Work Works__how-ethical-are-you'>
            <h1 className='Work__h1'>How Ethical Are You? Fjord Trends 2018 Installation</h1>
            <img className='Work__img' src={test8} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className='col-xs-12 col-md-5 col-md-offset-5'>
          <div className='Work Works__exp1'>
            <h1 className='Work__h1'>EXP 1: FIIRE</h1>
            <img className='Work__img rellax' data-rellax-speed={-0.65} src={test11} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className='col-xs-12 col-md-5 col-md-offset-1'>
          <div className='Work Works__vivid-2018'>
            <h1 className='Work__h1'>Vivid Sydney 2018 Proposal</h1>
            <img className='Work__img' src={test9} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className='col-xs-12 col-md-5 col-md-offset-3'>
          <div className='Work Works__fjord-vibe'>
            <h1 className='Work__h1'>Fjord Vibe</h1>
            <img className='Work__img' src={test10} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className='col-xs-12 col-md-5'>
          <div className='Work Works__siam'>
            <h1 className='Work__h1 rellax' data-rellax-speed={-0.25}>Sydney Interactive Arts Meetup</h1>
            <img className='Work__img' src={img1} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12 col-md-5 col-md-offset-5'>
          <div className='Work Works__uts'>
            <h1 className='Work__h1'>Large Scale Interactive Wall for UTS</h1>
            <img className='Work__img' src={test} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12 col-md-5 col-md-offset-1'>
          <div className='Work Works__monster-world'>
            <h1 className='Work__h1 '>Monster World—Vivid Sydney</h1>
            <img className='Work__img rellax' src={test2} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12 col-md-5 col-md-offset-5'>
          <div className='Work Works__uob'>
            <h1 className='Work__h1 rellax' data-rellax-speed={-0.15}>United Overseas Bank Painting of the Year—ReImagined</h1>
            <img className='Work__img rellax' src={test23} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12 col-md-5 col-md-offset-7'>
          <div className='Work Works__pensivity'>
            <h1 className='Work__h1'>Pensivity—Beams Arts Festival</h1>
            <img className='Work__img' src={test3} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12 ol-md-5 col-md-offset-2'>
          <div className='Work Works__graffiti-me'>
            <h1 className='Work__h1'>Graffiti Me—Vivid Sydney</h1>
            <img className='Work__img' src={test4} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12 col-md-5 '>
          <div className='Work Works__the-creators rellax' data-rellax-speed={0.2}>
            <h1 className='Work__h1 rellax' data-rellax-speed={-0.6}>The Creators</h1>
            <img className='Work__img' src={test5} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12 col-md-5 col-md-offset-6'>
          <div className='Work Works__designing-4-mobile'>
            <h1 className='Work__h1'>Designing 4 Mobile Interaction w/ Augmented Objects</h1>
            <img className='Work__img' src={test6} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-xs-12 col-md-5 col-md-offset-2'>
          <div className='Work Works__cycle-shift'>
            <h1 className='Work__h1'>The Cycle Shift—Concept</h1>
            <img className='Work__img' src={test7} />
          </div>
        </div>
      </div>
      {/* <h1>Works</h1> */}
      {/* <h2>Coming soon 🏝</h2> */}
      {/* <WorkExample /> */}
    </div>
  )
}