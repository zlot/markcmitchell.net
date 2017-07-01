import React from 'react'


const LifeCanvas = () => (
<div>
  <div id="toolbar" style={{display: 'none'}}>

    <div className="button" id="about_button">About</div>
    <div className="menu" id="examples_menu">
        <div id="pattern_button">Patterns</div>
    </div>
    <div id="import_button" className="button">Import</div>
    <div className="button" id="settings_button">Settings</div>
    <div className="button" id="rewind_button">Rewind</div>
    <div className="button" id="run_button">Run</div>

    <table id="controls">
      <tbody>
        <tr>
            <td title="Normal speed"><div id="normalspeed_button">1</div></td>
            <td title="Slower"><div id="slower_button">&#171;</div></td>
            <td title="Faster"><div id="faster_button">&#187;</div></td>
        </tr>
        <tr>
            <td title="Fit pattern"><div id="initial_pos_button">F</div></td>
            <td title="Zoom in"><div id="zoomin_button">+</div></td>
            <td title="Zoom out"><div id="zoomout_button">&ndash;</div></td>
        </tr>
        <tr>
            <td title="Go north-west"><div id="nw_button">&#8598;</div></td>
            <td title="Go north"><div id="n_button">&#8593;</div></td>
            <td title="Go north-east"><div id="ne_button">&#8599;</div></td>
        </tr>
        <tr>
            <td title="Go east"><div id="e_button">&#8592;</div></td>
            <td title="Go to 0, 0"><div id="middle_button">M</div></td>
            <td title="Go west"><div id="w_button">&#8594;</div></td>
        </tr>
        <tr>
            <td title="Go south-west"><div id="sw_button">&#8601;</div></td>
            <td title="Go south"><div id="s_button">&#8595;</div></td>
            <td title="Go south-east"><div id="se_button">&#8600;</div></td>
        </tr>
      </tbody>
    </table>
</div>
<div id="statusbar" style={{display: 'none'}}>
    <div id="label_zoom" title="Zoom"></div>
    <div id="label_mou" title="Mouse Coordinates">0, 0</div>
    <div id="label_fps" title="Frames per Second">0</div>
    <div id="label_gen" title="Generation">0</div>
    <div id="label_pop" title="Population">0</div>
    <div id="label_step" title="Generation per Step">1</div>
    <span id="pattern_name" className="link" title="Pattern infos"></span>
</div>
<div id="overlay">
    <div id="about">
        <h2>Conway's Game of Life in JavaScript</h2>
        <div id="notice">

        </div>
        This is an implementation of <a href="http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">Conway's Game of Life</a> or
        more precisely, the super-fast <a href="https://en.wikipedia.org/wiki/Hashlife" target="_blank">Hashlife</a> algorithm,
        written in JavaScript using the <code>canvas</code>-tag. It can simulate the largest known patterns, including the
        <a href="?pattern=caterpillar" id="caterpillar_link" title="Click to load" className="link">Caterpillar</a> (7.6MB, 11m cells) and
        <a href="?pattern=gemini" id="gemini_link" title="Click to load" className="link">Gemini</a> (1.6MB, 846k cells).
        
        
        <div id="about_main" style={{display: 'none'}}>
            If you encounter any bugs or have feedback, you can contact me at <a title="Click to show Email" href="?pattern=email">this email</a>.
            
            Click on the pattern name on the bottom left to get some informations about the current pattern.
            
            
            <a href="examples" target="_blank">List of all patterns</a> &mdash;
            <a href="https://github.com/copy/life" target="_blank">Source code on Github</a> &mdash;
            <a href="https://github.com/copy/life/issues" target="_blank">Report an issue</a>
            
            
            <b>Controls:</b>
            <pre>
        Left mouse          - Move around
        Right mouse         - Create / Delete cells
        Mouse wheel         - Zoom

        Arrow keys, HJKL    - Move around
        +, -                - Zoom
        Space               - One generation forward
        Tab                 - Many generations forward
        Enter               - Run/Pause
        Backspace           - Rewind
        ]                   - Faster
        [                   - Slower
        Escape              - Close Popups
            </pre>
        </div>
        
        
        
        <span className="button2" id="about_close" style={{display: 'none'}}>Ok</span>
    </div>
    <div id="import_dialog" style={{display: 'none'}}>
        <h2>Import Pattern</h2>
        Supports RLE, Life 1.06, Plaintext
        
        
        <textarea placeholder="Paste pattern file here" id="import_text"></textarea>
        
        Or: <input type="file" id="import_file" />
        
        
        <div id="import_info"></div>
        
        
        
        <span id="import_submit" className="button2">Import</span>
        <span id="import_abort" className="button2">Abort</span>
    </div>
    <div id="alert" style={{display: 'none'}}>
        <div id="alert_text">
            <h2 id="pattern_title"></h2>
            <div id="pattern_description"></div>
            
            <div id="pattern_urls"></div>
            
            <div id="pattern_file_container">
                Pattern file: <a target="_blank" id="pattern_file_link" href=""></a>
            </div>
            <div id="pattern_link_container">
                Link to view online:
                <a id="pattern_link" target="_blank" href=""></a>
            </div>
        </div>
        
        
        <span className="button2" id="alert_close">Ok</span>
    </div>
    <div id="pattern_chooser" style={{display: 'none'}}>
        Source: <a href="http://www.conwaylife.com/wiki/Main_Page" target="_blank">www.conwaylife.com</a>. Thanks!
        <div id="pattern_list"></div>
        <span className="button2" id="pattern_close">Close</span>
    </div>
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
        <span id="settings_abort" className="button2">Abort</span>
    </div>
    <div id="loading_popup" style={{display: 'none'}} >
    </div>
</div>
</div>
)

export default LifeCanvas