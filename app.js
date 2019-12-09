pElements = document.getElementsByTagName("p");

for (var i = 0; i < pElements.length; i++) {
    pElements[i].onclick = function getPostDetailsOnClick() {
        var message = "";
        var user = "";
        var user_link = "";
        var link = "";

        console.log("getPostDetailsOnClick");
        console.log(this);

        // first parent div out *should* contain list of <p>
        var parentDiv1 = this.parentElement;
        var allPsInThisDiv = parentDiv1.getElementsByTagName("p");
        console.log(allPsInThisDiv);
        for (var pI = 0; pI < allPsInThisDiv.length; pI++) {
            var p = allPsInThisDiv[pI];
            message += "<p>" + p.innerText + "</p>";
        }
        console.log(message);

        // now we need to extract the user and link
        var parentDiv2 = parentDiv1.parentElement;
        var parentDiv3 = parentDiv2.parentElement;
        console.log(parentDiv3);

        var parentDiv3ATags = parentDiv3.getElementsByTagName("a");
        console.log(parentDiv3ATags);
        // now look into the divs
        var hasUser = false;
        var hasLink = false;
        for (var aI = 0; aI < parentDiv3ATags.length; aI++) {
            if (!hasUser && !hasLink) {
                var a = parentDiv3ATags[aI];
                var href = a.getAttribute("href");
                console.log(href);
                if (href.includes("/user/")) {
                    console.log("yay we found the user!");
                    user_link = href;
                    var user_name = a.innerText;
                    user = user_name;
                } else if (href.includes("/comments/")) {
                    link = href;
                }
            }

        }


    };
}