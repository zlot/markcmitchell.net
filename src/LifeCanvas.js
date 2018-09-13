import React from 'react'
import Controls from './Controls'

const LifeCanvas = ({
    run,
    isRunning,
    zoomIn,
    zoomOut,
    onMouseDown,
    onWheelScroll,
    showOutOfBoundsControl,
    resetToInitialCanvasPos
}) => (
<div className='LifeCanvas' onMouseDown={onMouseDown}>

    <canvas id='main-canvas'></canvas>

    <Controls 
        run={run} 
        runText={isRunning ? 'Stop🛑' : 'Mutate🔥'} 
        zoomIn={zoomIn} 
        zoomOut={zoomOut}
        onWheelScroll={onWheelScroll}
        showOutOfBoundsControl={showOutOfBoundsControl}
        resetToInitialCanvasPos={resetToInitialCanvasPos}
    />
</div>
)

export default LifeCanvas