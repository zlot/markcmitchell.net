import LifeUniverse from './life';
import LifeCanvasDrawer from './draw';
import formats from './formats';

function debug() {
    if(process.env.NODE_ENV === 'development') {
        console.log(...arguments)
    }
}

const DEFAULT_FPS = 20;

const BACKGROUND_COLOR = '#0b00b5';
const CELL_COLOR = '#ff0200';
const MAX_ZOOM_IN_LEVEL = 8;
const MAX_ZOOM_OUT_LEVEL = 0.5;
const CELL_BORDER = 0.25; // 0 to 0.5. default was 0.25

export default function Main()
{
    if(!document.addEventListener) {
        // IE 8 seems to switch into rage mode if the code is only loaded partly, so we are saying goodbye earlier
        return;
    }
    function $(id) {
        return document.getElementById(id);
    }    

    var

        // functions which is called when the pattern stops running
        /** @type {function()|undefined} */
        onstop,

        last_mouse_x,
        last_mouse_y,

        mouse_is_drawing_cell_on_state,

        // is the game running ?
        /** @type {boolean} */
        running = false,

        /** @type {number} */
        max_fps,

        /**
         * path to the folder with all patterns
         * @const
         */
        pattern_path = "examples/",

        loaded = false,

        
        life = new LifeUniverse(),
        drawer = new LifeCanvasDrawer();


    /** @type {function(function())} */
    var nextFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        setTimeout;


    this.userRun = () => {
        if(running) {
            stop();
            return false;
        }
        else {
            run();
            return true;
        }
    }

    this.userStop = () => {
        stop();
    }

    this.userZoomIn = () => {
        if(isAtMaxZoomIn()) return;

        drawer.zoom_centered(false);
        lazy_redraw(life.root);

        function isAtMaxZoomIn() {
            return drawer.cell_width >= MAX_ZOOM_IN_LEVEL ? true : false;
        }
    }
    this.userZoomOut = () => {
        if(isAtMaxZoomOut()) return;
             
        drawer.zoom_centered(true);
        lazy_redraw(life.root);

        function isAtMaxZoomOut() {
            return drawer.cell_width <= MAX_ZOOM_OUT_LEVEL ? true : false;
        }
    }

    setup.call(this)
    this.onMouseDown = (e) => 
    {
        if(e.nativeEvent.which === 3 || e.nativeEvent.which === 2) {}
        else if(e.nativeEvent.which === 1)
        {
            // reset the localDrawnPixels object.
            var props = Object.keys(localDrawnPixels);
            for (var i = 0; i < props.length; i++) {
                delete localDrawnPixels[props[i]];
            }
            var coords = drawer.pixel2cell(e.clientX, e.clientY);
            mouse_is_drawing_cell_on_state = !life.get_bit(coords.x, coords.y); // used in do_field_draw
            window.addEventListener("mousemove", do_field_draw, true);
            window.removeEventListener("mousemove", changeCursorToEraserOnHover, true);
            setEraserCursor(!mouse_is_drawing_cell_on_state)
            do_field_draw(e); // do it on first mousedown. listener takes care of holding down
        }

        return false;
    };    

    function changeCursorToEraserOnHover(e) {
        const coords = drawer.pixel2cell(e.clientX, e.clientY);
        const isHoveringOverLivingCell = life.get_bit(coords.x, coords.y);
        if(isHoveringOverLivingCell) {
            setEraserCursor(true);
        } else {
            setEraserCursor(false);
        }
    }


    function setEraserCursor(useBool) {
        if(!useBool) {
            if(document.body.classList.contains('eraser-cursor')) {
                document.body.classList.remove('eraser-cursor');
            }            
            return;  
        }
        if(!document.body.classList.contains('eraser-cursor')) {
            document.body.classList.add('eraser-cursor');
        }
    }

    // setup
    function setup()
    {
        if(loaded) {
            // onload has been called already
            return;
        }

        loaded = true;
        
        if(!drawer.init(document.getElementsByClassName('LifeCanvas')[0]))
        {
            alert("Canvas-less browsers are not supported. I'm sorry for that.");
            return;
        }
        
        init_ui.call(this);
        drawer.set_size(document.body.clientWidth, document.body.clientHeight);

        reset_settings();

        load_pattern('main.png');
        
        window.addEventListener("mousemove", changeCursorToEraserOnHover, true);

        function load_pattern(patternToLoad)
        {
            http_get(
                rle_link(patternToLoad),
                function(text) {
                    setup_pattern(text, patternToLoad);
                }
            );
        }

        function init_ui()
        {
            window.onresize = debounce(function()
            {
                drawer.set_size(document.body.clientWidth, document.body.clientHeight);
                requestAnimationFrame(lazy_redraw.bind(0, life.root));
            }, 500);

            $("rewind_button").onclick = function()
            {
                if(life.rewind_state)
                {
                    stop(function()
                    {
                        life.restore_rewind_state();

                        fit_pattern();
                        drawer.redraw(life.root);

                        update_hud();
                    });
                }
            }


            drawer.canvas.addEventListener("touchstart", function(e)
            {
                // left mouse simulation
                var ev = {
                    which: 1,
                    clientX: e.changedTouches[0].clientX,
                    clientY: e.changedTouches[0].clientY,
                };

                drawer.canvas.onmousedown(ev);

                e.preventDefault();
            }, false);

            drawer.canvas.addEventListener("touchmove", function(e)
            {
                var ev = {
                    clientX: e.changedTouches[0].clientX,
                    clientY: e.changedTouches[0].clientY,
                };

                do_field_move(ev);

                e.preventDefault();
            }, false);

            drawer.canvas.addEventListener("touchend", function(e)
            {
                window.onmouseup(e);
                e.preventDefault();
            }, false);

            drawer.canvas.addEventListener("touchcancel", function(e)
            {
                window.onmouseup(e);
                e.preventDefault();
            }, false);

            window.onmouseup = function(e)
            {
                last_mouse_x = null;
                last_mouse_y = null;
                window.removeEventListener("mousemove", do_field_draw, true);
                window.addEventListener("mousemove", changeCursorToEraserOnHover, true);
                setEraserCursor(!mouse_is_drawing_cell_on_state)
            }

            drawer.canvas.oncontextmenu = function(e)
            {
                return false;
            };

            drawer.canvas.onwheel = function(e) {
                e.preventDefault();
                drawer.move(-e.deltaX, -e.deltaY);
                lazy_redraw(life.root);
            }

            drawer.canvas.addEventListener("DOMMouseScroll", drawer.canvas.onmousewheel, false);

            window.onkeydown = function(e)
            {
                var chr = e.which,
                    do_redraw = false,
                    target = e.target.nodeName;

                if(target === "INPUT" || target === "TEXTAREA") {
                    return true;
                }
                if(e.ctrlKey || e.shiftKey || e.altKey) {
                    return true;
                }
                if(chr === 37 || chr === 72) {
                    drawer.move(15, 0);
                    do_redraw = true;
                }
                else if(chr === 38 || chr === 75) {
                    drawer.move(0, 15);
                    do_redraw = true;
                }
                else if(chr === 39 || chr === 76) {
                    drawer.move(-15, 0);
                    do_redraw = true;
                }
                else if(chr === 40 || chr === 74) {
                    drawer.move(0, -15);
                    do_redraw = true;
                }
                else if(chr === 27) {
                    // escape
                    return false;
                }
                else if(chr === 13) {   
                    // enter
                    this.userRun()
                    return false;
                }
                else if(chr === 189 || chr === 173 || chr === 109) {
                    // -
                    drawer.zoom_centered(true);
                    do_redraw = true;
                }
                else if(chr === 187 || chr === 61) {
                    // + and =
                    drawer.zoom_centered(false);
                    do_redraw = true;
                }
                else if(chr === 8) {
                    // backspace
                    $("rewind_button").onclick();
                    return false;
                }
                else if(chr === 219 || chr === 221) {
                    // [ ]
                    var step = life.step;

                    if(chr === 219)
                        step--;
                    else
                        step++;

                    if(step >= 0)
                    {
                        life.set_step(step);
                    }

                    return false;
                }

                if(do_redraw) {
                    lazy_redraw(life.root);
                    return false;
                }
                return true;
            }.bind(this);

            $("faster_button").onclick = function()
            {
                var step = life.step + 1;

                life.set_step(step);
            };

            $("slower_button").onclick = function()
            {
                if(life.step > 0)
                {
                    var step = life.step - 1;

                    life.set_step(step);
                }
            };

            $("normalspeed_button").onclick = function()
            {
                life.set_step(0);
            };

            $("initial_pos_button").onclick = function()
            {
                fit_pattern();
                lazy_redraw(life.root);
                update_hud();
            };

            var select_rules = $("select_rules").getElementsByTagName("span");

            for(var i = 0; i < select_rules.length; i++)
            {
                /** @this {Element} */
                select_rules[i].onclick = function()
                {
                    $("rule").value = this.getAttribute("data-rule");
                };
            }

            $("settings_submit").onclick = function()
            {
                var new_rule_s,
                    new_rule_b,
                    new_gen_step;


                new_rule_s = formats.parse_rule($("rule").value, true);
                new_rule_b = formats.parse_rule($("rule").value, false);

                new_gen_step = Math.round(Math.log(Number($("gen_step").value) || 0) / Math.LN2);

                life.set_rules(new_rule_s, new_rule_b);

                if(!new_gen_step || new_gen_step < 0) {
                    life.set_step(0);
                }
                else {
                    life.set_step(new_gen_step);
                }

                max_fps = Number($("max_fps").value);
                if(!max_fps || max_fps < 0) {
                    max_fps = DEFAULT_FPS;
                }

                drawer.border_width = parseFloat($("border_width").value);
                if(isNaN(drawer.border_width) || drawer.border_width < 0 || drawer.border_width > .5)
                {
                    drawer.border_width = CELL_BORDER;
                }

                $("statusbar").style.color = drawer.cell_color;
                $("statusbar").style.textShadow = "0px 0px 1px " + drawer.cell_color;

                $("toolbar").style.color = drawer.background_color;

                lazy_redraw(life.root);
            }

            $("settings_reset").onclick = function()
            {
                reset_settings();

                lazy_redraw(life.root);
            }

            $("settings_button").onclick = function()
            {
                $("rule").value = formats.rule2str(life.rule_s, life.rule_b);
                $("max_fps").value = max_fps;
                $("gen_step").value = Math.pow(2, life.step);

                $("border_width").value = drawer.border_width;
            };

        }
    }


    function rle_link(id)
    {
        return window.location.protocol + "//" + window.location.host + "/" + pattern_path + id + ".rle";
    }

    /**
     * @param {function()=} callback
     */
    function stop(callback)
    {
        if(running)
        {
            running = false;
            debug("Run");

            onstop = callback;
        }
        else
        {
            if(callback) {
                callback();
            }
        }
    }

    function reset_settings()
    {
        drawer.background_color = BACKGROUND_COLOR;
        drawer.cell_color = CELL_COLOR;

        drawer.border_width = CELL_BORDER;
        drawer.cell_width = 2;

        life.rule_s = 1 << 2 | 1 << 3; // 12 // 
        life.rule_b = 1 << 3; // 8 // 
        life.set_step(0);

        max_fps = DEFAULT_FPS;

        debug("zoom is 1:2");

        drawer.center_view();
    }


    /**
     * @param {String=} pattern_source_url
     */
    function setup_pattern(pattern_text, pattern_id, pattern_source_url)
    {
        var result = formats.parse_pattern(pattern_text.trim());

        if(result.error)
        {
            console.error(result.error);
            return;
        }

        stop(function()
        {
            var bounds = life.get_bounds(result.field_x, result.field_y);

            if(pattern_id && !result.title)
            {
                result.title = pattern_id;
            }

            life.clear_pattern();
            life.make_center(result.field_x, result.field_y, bounds);
            life.setup_field(result.field_x, result.field_y, bounds);

            life.save_rewind_state();
            
            if(result.rule_s && result.rule_b)
            {
                life.set_rules(result.rule_s, result.rule_b);
            }
            else
            {
                life.set_rules(1 << 2 | 1 << 3, 1 << 3); // 12/8
            }

            fit_pattern();
            drawer.redraw(life.root);

            update_hud();

            if(!pattern_source_url && pattern_id)
            {
                pattern_source_url = rle_link(pattern_id);
            }
        });
    }

    function fit_pattern()
    {
        var bounds = life.get_root_bounds();

        drawer.fit_bounds(bounds);
    }

    function run()
    {
        var n = 0,
            start,
            last_frame,
            frame_time = 1000 / max_fps,
            interval,
            per_frame = frame_time;

        running = true;

        // runChangeRulesLive()
        // Occasionally change rules to encourage more strange growth
        // Also increases CPU load. Might skip doing this for now.
        function runChangeRulesLive() {
            setInterval(() => {
                // const coralRule = {rule_s: 496, rule_b: 8};
                // const dayAndNightRule = {rule_s: 472, rule_b: 456};
                // const quickFadeRule = {rule_s: 52, rule_b: 328}
                // const golRule = {rule_s: 12, rule_b: 8}
                // const snowLifeRule = {rule_s: 142, rule_b: 8}
                // const assimilationRule = {rule_s: 240, rule_b: 56}
                const stainsRule = {rule_s: 492, rule_b: 456};
                const stainsRuleEncourageGrowth = {rule_s: 492, rule_b: 264};
                // Playing with this ... it doesn't like this rule (lots of load).
                // Find a rule that allows it to expand a bit, but doesn't tax the cpu!
                life.set_rules(stainsRuleEncourageGrowth.rule_s, stainsRuleEncourageGrowth.rule_b);
                setTimeout(() => {
                    life.set_rules(stainsRule.rule_s, stainsRule.rule_b);
                }, 300)
            }, 10000)
        }

        if(life.generation === 0)
        {
            life.save_rewind_state();
        }

        interval = setInterval(function()
        {
            update_hud(1000 / frame_time);
        }, 666);

        start = Date.now();
        last_frame = start - per_frame;

        function update()
        {
            if(!running)
            {
                clearInterval(interval);
                update_hud(1000 / frame_time);

                if(onstop) {
                    onstop();
                }
                return;
            }

            var time = Date.now();

            if(per_frame * n < (time - start))
            {
                life.next_generation(true);
                drawer.redraw(life.root);

                n++;

                // readability ... my ass
                frame_time += (-last_frame - frame_time + (last_frame = time)) / 15;

                if(frame_time < .7 * per_frame)
                {
                    n = 1;
                    start = Date.now();
                }
            }

            nextFrame(update);
        }

        update();
    }

    /**
     * @param {number=} fps
     */
    function update_hud(fps)
    {

        if(drawer.cell_width >= 1)
        {
            debug("zoom is 1:" + drawer.cell_width);
        }
        else
        {
            debug("zoom is " + 1 / drawer.cell_width + ":1");
        }
    }

    function lazy_redraw(node)
    {
        if(!running || max_fps < 15)
        {
            drawer.redraw(node);
        }
    }

    /**
     * @param {function(string,number)=} onerror
     */
    function http_get(url, onready, onerror)
    {
        var http = new XMLHttpRequest();

        http.onreadystatechange = function()
        {
            if(http.readyState === 4)
            {
                if(http.status === 200)
                {
                    onready(http.responseText, url);
                }
                else
                {
                    if(onerror)
                    {
                        onerror(http.responseText, http.status);
                    }
                }
            }
        };

        http.open("get", url, true);
        http.send("");

        return {
            cancel : function()
            {
                http.abort();
            }
        };
    }

    /*
     * The mousemove event which allows moving around
     */
    function do_field_move(e)
    {
        var dx = e.clientX - last_mouse_x,
            dy = e.clientY - last_mouse_y;

        drawer.move(dx, dy);

        //lazy_redraw(life.root);
    }

    // This object holds all the pixels that have been drawn during one mousedown.
    const localDrawnPixels = Object.create(null); 
    /*
     * The mousemove event which draw pixels
     */
    function do_field_draw(e)
    {
        let coords = drawer.pixel2cell(e.clientX, e.clientY);

        const a = Math.abs(coords.x - last_mouse_x);
        const b = Math.abs(coords.y - last_mouse_y);
        const distanceBetweenLastMousePosAndCurrent = Math.hypot(a, b);
        // if mouse_is_drawing_cell_on_state is false, we're erasing. Make cell size bigger!
        const CELL_SIZE_TO_DRAW_BASE = mouse_is_drawing_cell_on_state ? 8 : 28; // 8 before!
        const cellSizeToDrawSizedByVelocity = Math.floor(CELL_SIZE_TO_DRAW_BASE+(distanceBetweenLastMousePosAndCurrent*0.045));
               
        if(last_mouse_x === null || last_mouse_y === null) {
            setLastMousePosition(coords);
            drawCellsWithinSize(coords, CELL_SIZE_TO_DRAW_BASE)
            return;
        }
        const lerpValue = Math.max(0.05, 1-(distanceBetweenLastMousePosAndCurrent*0.03)); // determines how many times we loop drawCellsWithinSize due to the interpolation of last mouse pos and current pos 

        for(let i=0; i<1; i+=lerpValue) {
            const lerpedPos = lerp({x:last_mouse_x, y:last_mouse_y}, {x:coords.x,y:coords.y}, i);
            drawCellsWithinSize(lerpedPos, returnEvenNumberFrom(cellSizeToDrawSizedByVelocity))
        }
        // Makes sure that the cell is drawn in correct grid structure
        function returnEvenNumberFrom(val) {
            return val % 2 === 0 ? val : val+1;
        }

        setLastMousePosition(coords);
       
        function drawCellsWithinSize(pos, cellSize) {
            for(let y = pos.y-cellSize/2; y<pos.y+cellSize/2; y++) {
                // don't use localDrawnPixels array if we're erasing
                if(mouse_is_drawing_cell_on_state && typeof localDrawnPixels[y] === 'undefined') {
                    localDrawnPixels[y] = {}
                }
                for(let x = pos.x-cellSize/2; x<pos.x+cellSize/2; x++) {
                    if(mouse_is_drawing_cell_on_state && localDrawnPixels[y][x] === true) {
                        // exists already, skip
                        continue
                    }
                    life.set_bit(x, y, mouse_is_drawing_cell_on_state);
                    drawer.draw_cell(x, y, mouse_is_drawing_cell_on_state);
                    if(mouse_is_drawing_cell_on_state) localDrawnPixels[y][x] = true
                }
            }
        }

        function setLastMousePosition(coords) {
            last_mouse_x = coords.x;
            last_mouse_y = coords.y;
        }

        function lerp(a, b, frac) {
            var nx = a.x+(b.x-a.x)*frac;
            var ny = a.y+(b.y-a.y)*frac;
            return {x: Math.floor(nx),  y: Math.floor(ny)};
        }
    }

    function set_query(filename)
    {
        if(!window.history.replaceState)
        {
            return;
        }

        if(filename)
        {
            window.history.replaceState(null, "", "?pattern=" + filename);
        }
        else
        {
            window.history.replaceState(null, "", "/life/");
        }
    }

    function hide_element(node)
    {
        node.style.display = "none";
    }

    function show_element(node)
    {
        node.style.display = "block";
    }

    // Put sep as a seperator into the thousands spaces of and Integer n
    // Doesn't handle numbers >= 10^21
    function format_thousands(n, sep)
    {
        if(n < 0)
        {
            return "-" + format_thousands(-n, sep);
        }

        if(isNaN(n) || !isFinite(n) || n >= 1e21)
        {
            return n + "";
        }

        function format(str)
        {
            if(str.length < 3)
            {
                return str;
            }
            else
            {
                return format(str.slice(0, -3)) + sep + str.slice(-3);
            }
        }

        return format(n + "");
    };


    function debounce(func, timeout)
    {
        var timeout_id;

        return function()
        {
            var me = this,
                args = arguments;

            clearTimeout(timeout_id);

            timeout_id = setTimeout(function()
            {
                func.apply(me, Array.prototype.slice.call(args));
            }, timeout);
        }
    }


}