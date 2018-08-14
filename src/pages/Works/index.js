import React from 'react'
// import img2 from './imgs/2.jpg'
// import img3 from './imgs/3.jpg'
// import img4 from './imgs/4.jpg'
import sydInteractiveArts from './imgs/sydInteractiveArts.jpg'
import utsWall from './imgs/utsWall.jpg'
import monsterWorld from './imgs/monsterWorld.jpg'
import uobPaintingOfTheYear from './imgs/uobPaintingOfTheYear.jpg'
import pensivity from './imgs/pensivity.jpg'
import graffitiMe from './imgs/graffitiMe.jpg'
import theCreators from './imgs/theCreators.png'
import designing4MobileInteraction from './imgs/designing4MobileInteraction.jpg'
import areYouEthical from './imgs/areYouEthical.jpg'
import vividSydneyProp from './imgs/vividSydneyProp.jpg'
import fjordVibe from './imgs/fjordVibe.jpg'
import exp1Fiire from './imgs/exp1Fiire.jpg'
import Rellax from 'rellax'

// const WorkExample = () => (
//   <article className='WorkDetail'>
//     <div className='Work__description'>
//       <h2>Sydney Interactive Arts Meetup</h2>
//       <p>I co-founded the Sydney Interactive Arts Meetup to create a community where professionals, industry, and hobbyists can get together to discuss and collaborate on all things related to interactive art.</p>
//       <p>Emila and myself have fostered a community to share ideas and projects, find collaborators, and get feedback and support from active and passionate members.</p>
//       <p>The meetup welcomes creatives, makers, developers, artists, designers, musicians, creative coders, anyone interested in the intersection of art and technology.</p>
//       <p>Previous speakers have included Mat Tizard from The Zoo (Google), Code on Canvas, and S1T2.</p>
//     </div>
//     <img src={sydInteractiveArts} />
//     <img src={img2} />
//     <img src={img3} />
//     <img src={img4} />
//   </article>
// )

export default class Works extends React.Component {

  componentDidMount = () => {
    const rellax = new Rellax('.rellax', {
      center: true,
      speed: -0.25
    })
  }
  render = () => (
    <div className='Works container'>
      <div className='row'>
        <div className='col-12'>
          <h1>Works</h1>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <p className='Works__under-construction'>🚨! page under construction !🚨</p>
        </div>
      </div>
      <div className="row">
        <div className='col-12 col-md-8 col-lg-6 col-xl-5 offset-lg-1'>
          <div className='Work Works__how-ethical-are-you'>
            <h2 className='Work__h2'>Are You Ethical?</h2>
            <img className='Work__img' src={areYouEthical} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className='col-12 col-md-8 col-lg-6 col-xl-5 offset-xl-5'>
          <div className='Work Works__exp1'>
            <h2 className='Work__h2'>EXP 1: FIIRE</h2>
            <img className='Work__img rellax' data-rellax-speed={-0.65} src={exp1Fiire} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className='col-12 col-md-8 offset-md-4 col-lg-6 col-xl-5 offset-xl-2'>
          <div className='Work Works__vivid-2018'>
            <h2 className='Work__h2'>Vivid Sydney 2018 Proposal</h2>
            <img className='Work__img' src={vividSydneyProp} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className='col-12 col-md-8 col-lg-6 col-xl-5 offset-xl-3'>
          <div className='Work Works__fjord-vibe'>
            <h2 className='Work__h2'>Fjord Vibe</h2>
            <img className='Work__img' src={fjordVibe} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className='col-12 col-xl-5'>
          <div className='Work Works__siam'>
            <h2 className='Work__h2 rellax' data-rellax-speed={-0.25}>Sydney Interactive Arts Meetup</h2>
            <img className='Work__img' src={sydInteractiveArts} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 col-md-8 offset-md-3 col-lg-6 col-xl-5 offset-xl-5'>
          <div className='Work Works__uts'>
            <h2 className='Work__h2'>Large Scale Interactive Wall—<br/>UTS</h2>
            <img className='Work__img' src={utsWall} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 col-md-8 offset-md-1 col-lg-6 col-xl-5 offset-xl-1'>
          <div className='Work Works__monster-world'>
            <h2 className='Work__h2 '>Monster World—Vivid Sydney</h2>
            <img className='Work__img rellax' src={monsterWorld} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 col-md-8 offset-md-2 col-lg-6 col-xl-5 offset-xl-5'>
          <div className='Work Works__uob'>
            <h2 className='Work__h2 rellax' data-rellax-speed={-0.15}>United Overseas Bank Painting of the Year—ReImagined</h2>
            <img className='Work__img rellax' src={uobPaintingOfTheYear} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 col-md-6 offset-md-6 col-lg-6 col-xl-5 offset-xl-7'>
          <div className='Work Works__pensivity'>
            <h2 className='Work__h2'>Pensivity—Beams Arts Festival</h2>
            <img className='Work__img' src={pensivity} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 col-md-8 offset-md-4 col-lg-6 col-xl-5 offset-xl-2'>
          <div className='Work Works__graffiti-me'>
            <h2 className='Work__h2'>Graffiti Me—Vivid Sydney</h2>
            <img className='Work__img' src={graffitiMe} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 col-lg-5'>
          <div className='Work Works__the-creators rellax' data-rellax-speed={0.2}>
            <h2 className='Work__h2 rellax' data-rellax-speed={-0.6}>The Creators</h2>
            <img className='Work__img' src={theCreators} />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 col-md-5 offset-md-6 col-lg-6 col-xl-5 offset-xl-6'>
          <div className='Work Works__designing-4-mobile'>
            <h2 className='Work__h2'>Designing 4 Mobile Interaction w/ Augmented Objects</h2>
            <img className='Work__img' src={designing4MobileInteraction} />
          </div>
        </div>
      </div>
      {/* <h2>Coming soon 🏝</h2> */}
      {/* <WorkExample /> */}
    </div>
  )
}