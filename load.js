import { set_draggable, Dragtype } from "./drag.js"
import { set_lists, table, set_dialogue, open_dialogue } from "./file_viewer.js"
import { } from "./data/subjects.js"

(function () {
    let dr = new Dragtype([false, true], [[0, 0], [0, Infinity]]);
    window.addEventListener(
        "DOMContentLoaded",
        event => {
            set_dialogue();
            var oReq = new XMLHttpRequest();
            oReq.addEventListener("load", reqListener);
            oReq.open("GET", "http://localhost:5500/data/cources.json");
            oReq.send();
            function reqListener() {
                const json = JSON.parse(this.responseText);
                let container = document.querySelectorAll("list-folder")[1];
                json.cources.forEach(cource => {
                    let e = document.createElement("list-element");
                    e.innerText = cource.title;
                    e.onclick = event => {
                        event.stopPropagation();
                        let info = document.createElement("cource");

                        let title = document.createElement("title");
                        let key = document.createElement("key");
                        let value = document.createElement("value");
                        key.innerText = "title";
                        value.innerText = cource.title;
                        title.appendChild(key);
                        title.appendChild(value);


                        info.appendChild(title);
                        open_dialogue(info);
                    };
                    container.appendChild(e);
                });
                set_lists();
                table(json.cources);
            }
        }
    );
})();