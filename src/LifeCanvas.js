import React from 'react'
import Controls from './Controls'

const LifeCanvas = ({
    run,
    isRunning,
    zoomIn,
    zoomOut,
    onMouseDown,
    onWheelScroll
}) => (
<div className='LifeCanvas' onMouseDown={onMouseDown}>

    <canvas id='main-canvas'></canvas>

    <Controls 
        run={run} 
        runText={isRunning ? 'Stop🛑' : 'Run🔥'} 
        zoomIn={zoomIn} 
        zoomOut={zoomOut}
        onWheelScroll={onWheelScroll}
    />
</div>
)

export default LifeCanvas