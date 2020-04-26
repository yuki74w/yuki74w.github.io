window.addEventListener("DOMContentLoaded", init);

function init() {
    document.querySelectorAll("checkbox").forEach(
        element => {
            element.addEventListener("click", onclick_checkbox);
        }
    );

    let cluster = document.querySelector("select[name=cluster]");

    cluster.addEventListener("change", event => {
        let is_2 = event.target.value == 2;
        document.querySelector("item[name=area]")
            .style.display = is_2 ? "flex" : "none";
        if (!is_2)
        {
            let myevent = new CustomEvent("status", {
                detail: {
                    "name": "area",
                    "value": "unspecified"
                }
            });
            window.parent.dispatchEvent(myevent);
        }
        set_department_option();
    }
    );

    document.querySelectorAll("select, input").forEach(
        element => {
            element.addEventListener("change",
                event => {
                    let myevent = new CustomEvent("status", {
                        detail: {
                            "name": event.target.getAttribute("name"),
                            "value": event.target.value
                        }
                    });
                    window.parent.dispatchEvent(myevent);
                });
        }
    );
    

    let myevent = new CustomEvent("status", {
        detail: {
            "name": "name",
            "value": "name"
        }
    });
    window.dispatchEvent(myevent);

    document.querySelectorAll("item").forEach(
        element => {
            let line = document.createElement("line");
            line.setAttribute("hidden", "");
            element.appendChild(line);
        }
    )

    set_department_option();


    document.querySelector("item[name=student-number] line")
        .removeAttribute("hidden");

    document.querySelector("item[name=autoinput] form checkbox")
        .addEventListener("click", toggle_studentnumber);
}

function set_department_option()
{
    let cluster_form = document.querySelector("select[name=cluster]");
    let departments_form = document.querySelector("select[name=department]");
    Array.from(departments_form.children).forEach(
        element => {
            element.remove();
        }
    );

    let I_departments = [
        ["media", "Media"],
        ["manage", "Management"]
    ];

    let II_departments = [
        ["security", "Security"]
    ];

    let III_departments = [
        ["phys", "Phys"]
    ];

    let departments = [
        I_departments,
        II_departments,
        III_departments
    ];

    let cluster_index = Number.parseInt(cluster_form.value);
    if ([1, 2, 3].includes(cluster_index))
    {
        let unspecifing_option = document.createElement("option");
        unspecifing_option.value = "unspecified";
        unspecifing_option.innerText = "未指定";
        departments_form.appendChild(unspecifing_option);
        departments[cluster_index - 1].forEach(
            element => {
                let option = document.createElement("option");
                option.value = element[0];
                option.innerText = element[1];
                departments_form.appendChild(option);
            }
        );
    }
    
}

function onclick_checkbox(event) {
    let target = event.target;
    let is_checked = target.hasAttribute("checked");
    if (is_checked)
    {
        target.removeAttribute("checked");
    } else {
        target.setAttribute("checked", "");
    }
}

function set_available(target, availability)
{
    let form = target.querySelector("form *");
    let line = target.querySelector("line");

    if (availability) {
        if (form.tagName == "INPUT" && form.getAttribute("type") == "number") {
            form.value = "";
        }
        form.setAttribute("readonly", "");
        line.removeAttribute("hidden");
        target.removeAttribute("available");
    }else {
        line.setAttribute("hidden", "");
        form.removeAttribute("readonly", "");
        target.setAttribute("available", "");
    }
}

function toggle_studentnumber(event) {
    let studentnumber = document.querySelector("item[name=student-number]");
    if (studentnumber != undefined)
    {
        set_available(studentnumber, !event.target.hasAttribute("checked"));
            let myevent = new CustomEvent("status", {
                detail: {
                    "name": "student-number",
                    "value": "unspecified"
                }
            });
            window.parent.dispatchEvent(myevent);
    }
}