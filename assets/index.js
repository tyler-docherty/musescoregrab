const submitForm = () => {
    const link = document.getElementById("input").value;
    let body = JSON.stringify({"link": link});
    fetch("/getSheets", {
        method: "POST",
        credentials: "omit",
        body: body,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => res.json())
        .then((res) => {
            document.getElementById("main").style.display = "none"
            res.forEach((image) => {
                let img = document.createElement("img");
                img.src = image;
                img.width = 794;
                img.height = 1122;
                document.getElementById("sheets").appendChild(img)
            })
        })
        .catch((err) => {
            console.error(err);
        });
}