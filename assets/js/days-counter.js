{
    "use strict";
    const tday = new Date();
    const sday = new Date(2014,8-1,9);
    const count = Math.ceil((tday.getTime()-sday.getTime())/(24*60*60*1000));

    // DOM編集
    const element = document.getElementById("amit-days");
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    const span = document.createElement("span");
    span.classList.add("amit-days-count");
    span.textContent = count;

    p1.textContent = "AMiT始動から";
    p2.appendChild(span);
    p2.append(" 日経過");

    element.appendChild(p1);
    element.appendChild(p2);
}
