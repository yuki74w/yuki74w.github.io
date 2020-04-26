import { check, name } from "./types.js"

function Dragtype(enables, ranges)
{
    if (!check([Array, Array], Array.from(arguments)))
        return undefined;
    this.enables = enables;
    this.ranges = ranges;
    name(this, "Dragtype");
}

function set_draggable(elem, drag_type, delay, click_call, begin_call, drag_call, end_call)
{
    let reserve_id = 0;
    elem.onmousedown = event => {
        //elem.style.zIndex = "0";
        window.onmousemove = () => {
            clearTimeout(reserve_id);
            drag_begin(event);
        };
        reserve_id = setTimeout(drag_begin.bind(null, event), delay);
    };
    window.onmouseup = event => {
        elem.style.zIndex = "auto";
        clearTimeout(reserve_id);
        click_call(event);
    };

    let ref_mouse_pos = [0, 0];
    let ref_elem_pos = [0, 0];

    function drag_begin(event)
    {
        event.target.setAttribute("dragging", "true");
        ref_mouse_pos = [event.clientX, event.clientY];
        ref_elem_pos = [event.target.offsetLeft, event.target.offsetTop];
        window.onmousemove = drag.bind(null, event.target);
        window.onmouseup = drag_end.bind(null, event.target);
        begin_call();
    }

    function drag(elem, event)
    {
        let offset = [
            event.clientX - ref_mouse_pos[0] + ref_elem_pos[0],
            event.clientY - ref_mouse_pos[1] + ref_elem_pos[1]
        ];
        offset.forEach((e, i) => {
            offset[i] = Math.max(drag_type.ranges[i][0], offset[i]);
            offset[i] = Math.min(drag_type.ranges[i][1], offset[i]);
            if (!drag_type.enables[i]) offset[i] = 0;
            
        });
        elem.style.left = (offset[0]).toString() + "px";
        elem.style.top = (offset[1]).toString() + "px";
        drag_call(offset);
    }

    function drag_end(elem, event)
    {
        window.onmousemove = null;
        elem.setAttribute("dragging", "false");
        set_draggable(elem, drag_type, delay, click_call, begin_call, drag_call, end_call);
        elem.style.zIndex = "auto";
        end_call();
    }
}


export {set_draggable, Dragtype}