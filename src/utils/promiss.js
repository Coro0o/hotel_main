exports.getPromiss = function () {
    let str = window.sessionStorage.getItem("name");
    if (str === "admin") {
        return false;
    }
    return true;
}