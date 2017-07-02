import React from 'react'


const LifeCanvas = () => (
<div className='LifeCanvas'>
    <div id="toolbar" style={{display: 'none'}}>

        <div className="button" id="settings_button">Settings</div>
        <div className="button" id="rewind_button">Rewind</div>

        <table id="controls">
            <tbody>
                <tr>
                    <td title="Normal speed"><div id="normalspeed_button">1</div></td>
                    <td title="Slower"><div id="slower_button">&#171;</div></td>
                    <td title="Faster"><div id="faster_button">&#187;</div></td>
                </tr>
                <tr>
                    <td title="Fit pattern"><div id="initial_pos_button">F</div></td>
                </tr>
            </tbody>
        </table>
    </div>
    <div id="statusbar" style={{display: 'none'}}>
        <div id="label_mou" title="Mouse Coordinates">0, 0</div>
        <div id="label_fps" title="Frames per Second">0</div>
        <div id="label_gen" title="Generation">0</div>
        <div id="label_pop" title="Population">0</div>
        <div id="label_step" title="Generation per Step">1</div>
    </div>

    <div>

        <div id="settings_dialog" style={{display: 'none'}}>
            <h2>Settings</h2>
            <div className="left" id="select_rules">
                Rule
                <small>
                    Or pick one:
                    <span className="link" data-rule="23/3">Conway</span>
                    <span className="link" data-rule="23/36">HighLife</span>
                    <span className="link" data-rule="125/36">2x2</span>
                    <span className="link" data-rule="1357/1357">Replicator</span>
                </small>
            </div>
            <div className="right">
                <input type="text" id="rule" />
            </div>
            
            <div className="left">
                Maximum Frames per Second
            </div>
            <div className="right">
                <input type="number" min="1" id="max_fps" style={{width: 60}} />
            </div>
            
            <div className="left">
                Generation step
                <small>Only powers of 2 (automatically rounded)</small>
            </div>
            
            <div className="left">
                Border width
                <small>0 .. 0.5</small>
            </div>
            <div className="right">
                <input type="number" min="0" max="0.5" step="0.05" id="border_width" style={{width: 60}} />
            </div>
            
            
            
            <hr />
            
            
            <span id="settings_submit" className="button2">Save</span>
            <span id="settings_reset" className="button2">Reset</span>
        </div>
        <div id="loading_popup" style={{display: 'none'}} ></div>
    </div>
</div>
)

export default LifeCanvas