import { set_draggable, Dragtype } from "./drag.js"

function set_lists()
{
    document.querySelectorAll("list").forEach(element => {
        set_fileviwer(element);
    });
}

function set_fileviwer(elem) {
    let entity = elem.querySelector("list-container");
    let scrollthumb = document.createElement("list-scroll-thumb");
    let scrollbar = document.createElement("list-scroll-bar");
    scrollbar.appendChild(scrollthumb);
    elem.appendChild(scrollbar);

    let folders = elem.querySelectorAll("list-folder");
    function folder_onclick(event) {
        let folder = this;
        let is_expanded = folder.getAttribute("is_expanded");
        if (is_expanded == "false") {
            folder.setAttribute("is_expanded", "true");
            folder.style.height = folder.scrollHeight.toString() + "px";
            folder.style.minHeight = folder.scrollHeight.toString() + "px";
        }
        else if (is_expanded == "true") {
            folder.style.height = "1.6em";
            folder.style.minHeight = "1.6em";
            folder.setAttribute("is_expanded", "false");
        }
    }
    folders.forEach(folder => {
        folder.style.height = "1.6em";
        folder.style.minHeight = "1.6em";
        folder.setAttribute("is_expanded", "false");
        let label = document.createElement("label");
        label.innerText = folder.getAttribute("name");
        folder.insertBefore(label, folder.firstChild);
        folder.onclick = folder_onclick;
        folder.addEventListener(
            "transitionend", event => {
                let wholeHeight = Math.max(entity.scrollHeight, entity.offsetHeight);
                scrollthumb.style.height = (entity.offsetHeight * entity.offsetHeight / wholeHeight).toString() + "px";
                dragtype.ranges[1] = [0, (entity.offsetHeight - scrollthumb.offsetHeight + 2)];
                set_draggable(scrollthumb, dragtype, 0, nopfunc, nopfunc, scrollfunc, nopfunc);
            }
        );
    });
    
    let wholeHeight = Math.max(entity.scrollHeight, entity.offsetHeight);
    scrollthumb.style.height = (entity.offsetHeight * elem.offsetHeight / wholeHeight).toString() + "px";
    entity.onscroll = function () {
        let wholeHeight = Math.max(entity.scrollHeight - entity.offsetHeight, entity.offsetHeight);
        var offset = (this.scrollTop) * (entity.offsetHeight - scrollthumb.offsetHeight) / wholeHeight;
        if(scrollthumb.getAttribute("dragging") != "true")
            scrollthumb.style.top = offset.toString() +  "px";
    };


    let dragtype = new Dragtype([false, true], [[0, 0], [0, (elem.offsetHeight - scrollthumb.offsetHeight+2)]])
    let nopfunc = Function.prototype;
    function scrollfunc(offset)
    {
        entity.scroll(0, (entity.scrollHeight - elem.offsetHeight)*offset[1]/(entity.offsetHeight - scrollthumb.offsetHeight));
    }
    set_draggable(scrollthumb, dragtype, 0, nopfunc, nopfunc, scrollfunc, nopfunc);
}

function table(obj) {
    let elem = document.querySelector("time-table");
    Array.from(elem.children).forEach(e => {
        e.remove();
    });
    for (let i = 1; i < 8; i++)
    {
        for (let j = 1; j < 8; j++) {
            let item = document.createElement("item");
            item.style.gridColumn = i.toString() + "/" + (i + 1).toString();
            item.style.gridRow = j.toString() + "/" + (j + 1).toString();
            if (i == 1 || j == 1)
            {
                if (i == 1 && j > 1)
                {
                    item.innerText = (j-1).toString();
                } else {
                    switch (i) {
                        case 2:
                            item.innerText = "Mon";
                            break;
                        case 3:
                            item.innerText = "Tue";
                            break;
                        case 4:
                            item.innerText = "Wed";
                            break;
                        case 5:
                            item.innerText = "Thu";
                            break;
                        case 6:
                            item.innerText = "Fri";
                            break;
                        case 7:
                            item.innerText = "Sat";
                            break;
                        default:
                            break;
                    }
                }
            }
            else {
                item.onclick = event => {
                    let scrollthumb = document.createElement("list-scroll-thumb");
                    let scrollbar = document.createElement("list-scroll-bar");
                    scrollbar.appendChild(scrollthumb);

                    let list = document.createElement("list");
                    let entity = document.createElement("list-container");
                    let grade = document.querySelector("select[name=grade]").value;
                    let selected_cluster = document.querySelector("select[name=faculty]").value;
                    let filtered = obj.filter(cource => {
                        let res = false;
                        cource.time.forEach(
                            time => {
                                res |= (
                                    (time.week == "mon" && i == 2) ||
                                    (time.week == "tue" && i == 3) ||
                                    (time.week == "wed" && i == 4) ||
                                    (time.week == "thu" && i == 5) ||
                                    (time.week == "fri" && i == 6) ||
                                    (time.week == "sat" && i == 7)
                                ) && ((j - 1) == time.period);
                            }
                        );
                        let is_targeted = false;
                        cource.detail.general.targets.forEach(
                            e => {
                                is_targeted |= (grade == e);
                            }
                        );
                        let belonged_cluster = false;

                        let cluster = cource.detail.general.cluster;
                        if (cluster.includes("情報理工学域"))
                        {
                            belonged_cluster = true;
                        }
                        if (cluster.includes("Ⅰ類") && selected_cluster==1) {
                            belonged_cluster = true;
                        }
                        if (cluster.includes("Ⅱ類") && selected_cluster == 2) {
                            belonged_cluster = true;
                        }
                        if (cluster.includes("Ⅲ類") && selected_cluster == 3) {
                            belonged_cluster = true;
                        }
                        res &= (is_targeted && belonged_cluster);
                        return res;
                    });
                    filtered.forEach(cource => {
                        let e = document.createElement("list-element");
                        e.innerText = cource.title;
                        e.onclick = event => {
                            event.stopPropagation();
                            let info = document.createElement("info");
                            info.innerText = cource.detail.description.outline;
                            open_dialogue(info);
                        };
                        entity.appendChild(e);
                    });;
                    list.appendChild(entity);
                    let screen = document.createElement("screen");
                    screen.appendChild(list);

                    entity.onscroll = function (event) {
                        let entity = this;
                        let wholeHeight = Math.max(entity.scrollHeight, entity.clientHeight);
                        var offset = (this.scrollTop) / wholeHeight * (entity.offsetHeight);
                        if (scrollthumb.getAttribute("dragging") != "true")
                            scrollthumb.style.top = offset.toString() + "px";
                    };


                    let dragtype = new Dragtype([false, true], [[0, 0], [0, (elem.offsetHeight - scrollthumb.offsetHeight + 2)]])
                    let nopfunc = Function.prototype;
                    function scrollfunc(offset) {
                        entity.scroll(0, (entity.scrollHeight - elem.offsetHeight) * offset[1] / (entity.offsetHeight - scrollthumb.offsetHeight));
                    }
                    set_draggable(scrollthumb, dragtype, 0, nopfunc, nopfunc, scrollfunc, nopfunc);
                    entity.appendChild(scrollbar);
                    open_dialogue(list);

                    let wholeHeight = Math.max(entity.scrollHeight, entity.offsetHeight);
                    scrollthumb.style.height = (entity.offsetHeight * entity.offsetHeight / wholeHeight).toString() + "px";
                };
            }
            
            elem.appendChild(item);
        }
    }
}

function set_dialogue()
{
    let body = document.querySelector("body");
    let screen = document.createElement("screen");
    body.appendChild(screen);
}

function open_dialogue(elem)
{
    let screen = document.querySelector("screen");
    screen.style.backgroundColor = "#222222dd";
    screen.style.visibility = "visible";
    let dialogs = screen.querySelectorAll("dialog");
    let max = 0;
    dialogs.forEach(e => { 
        if (max < e.style.zIndex) max = parseInt(e.style.zIndex);
    });
    let dialog = document.createElement("dialog");
    //dialog.style.zIndex = (max + 1).toString();
    dialog.appendChild(elem);
    let closer = document.createElement("closer");
    let stick = document.createElement("stick");
    closer.appendChild(stick);
    closer.onclick = event => {
        let dialogs = document.querySelector("screen").querySelectorAll("dialog");
        dialogs[dialogs.length - 1].remove();
        if (document.querySelector("screen").querySelectorAll("dialog").length == 0)
        {
            screen.style.backgroundColor = "#22222200";
            screen.style.visibility = "hidden";
        }
        closer.remove();
    };
    screen.appendChild(dialog);
    screen.appendChild(closer);
}



export { set_lists, table, set_dialogue, open_dialogue}