javascript:
var host = "__HOST__";
var s1 = document.createElement("script");
var c1 = document.createElement("link");
s1.setAttribute("src", host + "/static/js/cliu-loader.js");
c1.setAttribute("href", host + "/static/css/cloud-liu.css");
c1.setAttribute("rel", "stylesheet");
document.body.appendChild(s1);
document.head.appendChild(c1);
