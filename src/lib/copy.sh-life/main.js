import LifeUniverse from './life';
import LifeCanvasDrawer from './draw';
import formats from './formats';

var
    /** @const */
    DEFAULT_BORDER = 0.25,
    /** @const */
    DEFAULT_FPS = 20;


export default function Main()
{
    if(!document.addEventListener)
    {
        // IE 8 seems to switch into rage mode if the code is only loaded partly,
        // so we are saying goodbye earlier
        return;
    }

    var

        /**
         * which pattern file is currently loaded
         * @type {{title: String, urls, comment, id, source_url}}
         * */
        current_pattern,

        // functions which is called when the pattern stops running
        /** @type {function()|undefined} */
        onstop,

        last_mouse_x,
        last_mouse_y,

        mouse_set,

        // is the game running ?
        /** @type {boolean} */
        running = false,

        /** @type {number} */
        max_fps,

        // has the pattern list been loaded
        /** @type {boolean} */
        patterns_loaded = false,

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


    // setup
    window.onload = function()
    {
        
        if(loaded)
        {
            // onload has been called already
            return;
        }

        loaded = true;

        if(!drawer.init(document.body))
        {
            set_text($("notice").getElementsByTagName("h4")[0],
                "Canvas-less browsers are not supported. I'm sorry for that.");
            return;
        }

        init_ui.call(this);

        drawer.set_size(window.innerWidth, document.body.offsetHeight);
        reset_settings();

        // production setup
        var query = window.location.search.substr(1).split("&"),
            param,
            parameters = {};

        for(var i = 0; i < query.length; i++)
        {
            param = query[i].split("=");

            parameters[param[0]] = param[1];
        }

        if(parameters["step"] && /^\d+$/.test(parameters["step"]))
        {
            var step_parameter = Math.round(Math.log(Number(parameters["step"])) / Math.LN2);

            life.set_step(step_parameter);
        }

        load_pattern('main.png');

        if(parameters["noui"] === "1")
        {
            var elements = [
                "statusbar", "about_button", "examples_menu",
                "import_button", "settings_button", "zoomout_button",
                "zoomin_button", "rewind_button"
            ];

            for(var i = 0; i < elements.length; i++)
            {
                $(elements[i]).style.display = "none";
            }
        }

        if(parameters["fps"] && /^\d+$/.test(parameters["fps"]))
        {
            max_fps = +parameters["fps"];
        }

        function load_pattern(patternToLoad)
        {
            show_overlay("loading_popup");
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
                drawer.set_size(window.innerWidth, document.body.offsetHeight);
                requestAnimationFrame(lazy_redraw.bind(0, life.root));
            }, 500);

            $("run_button").onclick = function()
            {
                if(running)
                {
                    stop();
                }
                else
                {
                    run();
                }
            };

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

            drawer.canvas.ondblclick = function(e)
            {
                drawer.zoom(false, e.clientX, e.clientY);

                update_hud();
                lazy_redraw(life.root);
                return false;
            };


            drawer.canvas.onmousedown = function(e)
            {
                if(e.which === 3 || e.which === 2)
                {
                    var coords = drawer.pixel2cell(e.clientX, e.clientY);

                    mouse_set = !life.get_bit(coords.x, coords.y);

                    window.addEventListener("mousemove", do_field_draw, true);
                    do_field_draw(e);
                }
                else if(e.which === 1)
                {
                    last_mouse_x = e.clientX;
                    last_mouse_y = e.clientY;
                    //console.log("start", e.clientX, e.clientY);

                    window.addEventListener("mousemove", do_field_move, true);

                    (function redraw()
                    {
                        if(last_mouse_x !== null)
                        {
                            requestAnimationFrame(redraw);
                        }

                        lazy_redraw(life.root);
                    })();
                }

                return false;
            };

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
                window.removeEventListener("mousemove", do_field_move, true);
            }

            window.onmousemove = function(e)
            {
                var coords = drawer.pixel2cell(e.clientX, e.clientY);

                set_text($("label_mou"), coords.x + ", " + coords.y);
                fix_width($("label_mou"));
            }

            drawer.canvas.oncontextmenu = function(e)
            {
                return false;
            };

            drawer.canvas.onmousewheel = function(e)
            {
                e.preventDefault();
                drawer.zoom((e.wheelDelta || -e.detail) < 0, e.clientX, e.clientY);

                update_hud();
                lazy_redraw(life.root);
                return false;
            }

            drawer.canvas.addEventListener("DOMMouseScroll", drawer.canvas.onmousewheel, false);

            window.onkeydown = function(e)
            {
                var chr = e.which,
                    do_redraw = false,
                    target = e.target.nodeName;

                //console.log(e.target)
                //console.log(chr + " " + e.charCode + " " + e.keyCode);

                if(target === "INPUT" || target === "TEXTAREA")
                {
                    return true;
                }

                if(e.ctrlKey || e.shiftKey || e.altKey)
                {
                    return true;
                }

                if(chr === 37 || chr === 72)
                {
                    drawer.move(15, 0);
                    do_redraw = true;
                }
                else if(chr === 38 || chr === 75)
                {
                    drawer.move(0, 15);
                    do_redraw = true;
                }
                else if(chr === 39 || chr === 76)
                {
                    drawer.move(-15, 0);
                    do_redraw = true;
                }
                else if(chr === 40 || chr === 74)
                {
                    drawer.move(0, -15);
                    do_redraw = true;
                }
                else if(chr === 27)
                {
                    // escape
                    hide_overlay();
                    return false;
                }
                else if(chr === 13)
                {
                    // enter
                    $("run_button").onclick();
                    return false;
                }
                else if(chr === 189 || chr === 173 || chr === 109)
                {
                    // -
                    drawer.zoom_centered(true);
                    do_redraw = true;
                }
                else if(chr === 187 || chr === 61)
                {
                    // + and =
                    drawer.zoom_centered(false);
                    do_redraw = true;
                }
                else if(chr === 8)
                {
                    // backspace
                    $("rewind_button").onclick();
                    return false;
                }
                else if(chr === 219 || chr === 221)
                {
                    // [ ]
                    var step = life.step;

                    if(chr === 219)
                        step--;
                    else
                        step++;

                    if(step >= 0)
                    {
                        life.set_step(step);
                        set_text($("label_step"), Math.pow(2, step));
                    }

                    return false;
                }

                if(do_redraw)
                {
                    lazy_redraw(life.root);

                    return false;
                }

                return true;
            };

            $("faster_button").onclick = function()
            {
                var step = life.step + 1;

                life.set_step(step);
                set_text($("label_step"), Math.pow(2, step));
            };

            $("slower_button").onclick = function()
            {
                if(life.step > 0)
                {
                    var step = life.step - 1;

                    life.set_step(step);
                    set_text($("label_step"), Math.pow(2, step));
                }
            };

            $("normalspeed_button").onclick = function()
            {
                life.set_step(0);
                set_text($("label_step"), 1);
            };

            $("zoomin_button").onclick = function()
            {
                drawer.zoom_centered(false);
                update_hud();
                lazy_redraw(life.root);
            };

            $("zoomout_button").onclick = function()
            {
                drawer.zoom_centered(true);
                update_hud();
                lazy_redraw(life.root);
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

            $("import_submit").onclick = function()
            {
                var previous = current_pattern && current_pattern.title;
                var files = $("import_file").files;

                function load(text)
                {
                    setup_pattern(text, undefined);
                }

                if(files && files.length)
                {
                    let filereader = new FileReader();
                    filereader.onload = function()
                    {
                        load(filereader.result);
                    }
                    filereader.readAsText(files[0]);
                }
                else
                {
                    load($("import_text").value);
                }
            };

            $("import_abort").onclick = function()
            {
                hide_overlay();
            };

            $("import_button").onclick = function()
            {
                show_overlay("import_dialog");
                $("import_text").value = "";

                set_text($("import_info"), "");
            };

            $("settings_submit").onclick = function()
            {
                var new_rule_s,
                    new_rule_b,
                    new_gen_step;

                hide_overlay();

                new_rule_s = formats.parse_rule($("rule").value, true);
                new_rule_b = formats.parse_rule($("rule").value, false);

                new_gen_step = Math.round(Math.log(Number($("gen_step").value) || 0) / Math.LN2);

                life.set_rules(new_rule_s, new_rule_b);

                if(!new_gen_step || new_gen_step < 0) {
                    life.set_step(0);
                    set_text($("label_step"), "1");
                }
                else {
                    life.set_step(new_gen_step);
                    set_text($("label_step"), Math.pow(2, new_gen_step));
                }

                max_fps = Number($("max_fps").value);
                if(!max_fps || max_fps < 0) {
                    max_fps = DEFAULT_FPS;
                }

                drawer.border_width = parseFloat($("border_width").value);
                if(isNaN(drawer.border_width) || drawer.border_width < 0 || drawer.border_width > .5)
                {
                    drawer.border_width = DEFAULT_BORDER;
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

                hide_overlay();
            }

            $("settings_button").onclick = function()
            {
                show_overlay("settings_dialog");

                $("rule").value = formats.rule2str(life.rule_s, life.rule_b);
                $("max_fps").value = max_fps;
                $("gen_step").value = Math.pow(2, life.step);

                $("border_width").value = drawer.border_width;
            };

            function show_pattern_chooser()
            {
                if(patterns_loaded)
                {
                    show_overlay("pattern_chooser");
                    return;
                }

                patterns_loaded = true;


                show_overlay("loading_popup");
                http_get(pattern_path + "list", function(text)
                {
                    var patterns = text.split("\n"),
                        list = $("pattern_list");

                    show_overlay("pattern_chooser");

                    patterns.forEach(function(pattern)
                    {
                        var
                            name = pattern.split(" ")[0],
                            size = pattern.split(" ")[1],
                            name_element = document.createElement("div"),
                            size_element = document.createElement("span");

                        set_text(name_element, name);
                        set_text(size_element, size);
                        size_element.className = "size";

                        name_element.appendChild(size_element);
                        list.appendChild(name_element);

                        name_element.onclick = function()
                        {
                            show_overlay("loading_popup");
                            http_get(rle_link(name), function(text)
                            {
                                setup_pattern(text, name);
                                set_query(name);

                                life.set_step(0);
                                set_text($("label_step"), "1");
                            });
                        }
                    });
                });
            };
        }
    }

    document.addEventListener("DOMContentLoaded", window.onload, false);


    function rle_link(id)
    {
        return window.location.protocol + "//" + window.location.host + window.location.pathname + pattern_path + id + ".rle";
    }

    function view_link(id)
    {
        return "https://copy.sh/life/?pattern=" + id;
    }

    /**
     * @param {function()=} callback
     */
    function stop(callback)
    {
        if(running)
        {
            running = false;
            set_text($("run_button"), "Run");

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
        drawer.background_color = "#000000";
        drawer.cell_color = "#cccccc";

        drawer.border_width = DEFAULT_BORDER;
        drawer.cell_width = 2;

        life.rule_b = 1 << 3;
        life.rule_s = 1 << 2 | 1 << 3;
        life.set_step(0);
        set_text($("label_step"), "1");

        max_fps = DEFAULT_FPS;

        set_text($("label_zoom"), "1:2");
        fix_width($("label_mou"));

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
            set_text($("import_info"), result.error);
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
                life.set_rules(1 << 2 | 1 << 3, 1 << 3);
            }

            hide_overlay();

            fit_pattern();
            drawer.redraw(life.root);

            update_hud();

            if(!pattern_source_url && pattern_id)
            {
                pattern_source_url = rle_link(pattern_id);
            }

            current_pattern = {
                title : result.title,
                comment : result.comment,
                urls : result.urls,
                id : pattern_id,
                source_url: pattern_source_url,
            };
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

        set_text($("run_button"), "Stop");

        running = true;

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

    function step(is_single)
    {
        var time = Date.now();

        if(life.generation === 0)
        {
            life.save_rewind_state();
        }

        life.next_generation(is_single);
        drawer.redraw(life.root);

        update_hud(1000 / (Date.now() - time));

        if(time < 3)
        {
            set_text($("label_fps"), "> 9000");
        }
    }

    function show_overlay(overlay_id)
    {
        show_element($("overlay"));

        // allow scroll bars when overlay is visible
        document.body.style.overflow = "auto";

        var overlays = $("overlay").children;

        for(var i = 0; i < overlays.length; i++)
        {
            var child = overlays[i];

            if(child.id === overlay_id)
            {
                show_element(child);
            }
            else
            {
                hide_element(child);
            }
        }
    }

    function hide_overlay()
    {
        hide_element($("overlay"));
        document.body.style.overflow = "hidden";
    }

    /**
     * @param {number=} fps
     */
    function update_hud(fps)
    {
        if(fps) {
            set_text($("label_fps"), fps.toFixed(1));
        }

        set_text($("label_gen"), format_thousands(life.generation, "\u202f"));
        fix_width($("label_gen"));

        
        set_text($("label_pop"), format_thousands(life.root.population, "\u202f"));
        fix_width($("label_pop"));

        if(drawer.cell_width >= 1)
        {
            set_text($("label_zoom"), "1:" + drawer.cell_width);
        }
        else
        {
            set_text($("label_zoom"), 1 / drawer.cell_width + ":1");
        }
    }

    function lazy_redraw(node)
    {
        if(!running || max_fps < 15)
        {
            drawer.redraw(node);
        }
    }

    function set_text(obj, text)
    {
        obj.textContent = String(text);
    }

    /**
     * fixes the width of an element to its current size
     */
    function fix_width(element)
    {
        element.style.padding = "0";
        element.style.width = "";

        if(!element.last_width || element.last_width < element.offsetWidth) {
            element.last_width = element.offsetWidth;
        }
        element.style.padding = "";

        element.style.width = element.last_width + "px";
    }


    function validate_color(color_str)
    {
        return /^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i.test(color_str) ? color_str : false;
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

        last_mouse_x = e.clientX;
        last_mouse_y = e.clientY;
    }

    /*
     * The mousemove event which draw pixels
     */
    function do_field_draw(e)
    {
        var coords = drawer.pixel2cell(e.clientX, e.clientY);

        // don't draw the same pixel twice
        if(coords.x !== last_mouse_x || coords.y !== last_mouse_y)
        {
            life.set_bit(coords.x, coords.y, mouse_set);
            update_hud();

            drawer.draw_cell(coords.x, coords.y, mouse_set);
            last_mouse_x = coords.x;
            last_mouse_y = coords.y;
        }
    }

    function $(id)
    {
        return document.getElementById(id);
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