window.addEventListener("DOMContentLoaded", init);

function init() {
    window.addEventListener("status", set_status);

    document.querySelectorAll("tab, tab-top").forEach(
        element => {
            element.addEventListener("click",
                event => {
                    let name = event.target.getAttribute("name");
                    let frame = document.querySelector("object");
                    if (name != undefined)
                    {
                        frame.data = "./contents/" + event.target.getAttribute("name") + ".html";
                    } else {
                        frame.data = "./contents/notfound.html";
                    }
                }
            )
        }
    );
    
}
function set_status(event) {
    if (event.detail.value == "unspecified")
    {
        window.parent.sessionStorage.removeItem(event.detail.name);
    } else {
        window.parent.sessionStorage.setItem(event.detail.name, event.detail.value);
    }
    

    let status_gui = document.querySelector("status");
    let status = Array.from(status_gui.children);
    
    let ref = status.find(element => {
        if (!element.hasAttribute("name")) {
            return false;
        }
        return element.getAttribute("name") == event.detail.name;
    });

    if (ref == undefined && event.detail.value != "unspecified")
    {
        let status = document.createElement("item");
        status.setAttribute("name", event.detail.name);
        status.setAttribute("value", event.detail.value);
        status.innerText = event.detail.value;
        status_gui.appendChild(status);
    } else {
        if (event.detail.value == "unspecified") {
            ref.remove();
        } else {
            ref.setAttribute("value", event.detail.value);
            ref.innerText = event.detail.value;
        }
    }
}