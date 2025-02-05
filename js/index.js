document.addEventListener("DOMContentLoaded", () => {
    window.onresize = function () {
        if (document.getElementById("right").width <= "400px") {
            alert("too small!")
        }
    }
});
