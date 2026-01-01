const name = document.getElementsByName("name")[0];
const role = document.getElementsByName("role")[0];
const subBtn = document.getElementById("subBtn");
const listEl = document.getElementById("list");

async function defaultFetchData() {
    const url = "http://localhost:8080/"
    try {
        const res = await (await fetch(url + "users")).json();
        if (res) {
            listEl.innerHTML = (res.map((item)=> `<li><b>${item.name}</b> | ${(item.role).toUpperCase()}</li>`)).join("");
        }
    } catch (err) {
        console.log("err: ", err.message);
    }
}

subBtn.onclick = async function () {
    const url = "http://localhost:8080/"
    try {
        const res = await (await fetch(url + "users")).json();
        if (res) {
            try {
                const st = await (await (await fetch(url + "add", {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name:name.value,
                        role:role.value
                    }),
                    method: "POST"
                }))).json();
                console.log("result with response: ",st);
                name.value = ""
                role.value = ""
            } catch (error) {
                console.log("error while post request: ", err.message);
            }
            defaultFetchData()
        }
    } catch (err) {
        console.log("err: ", err.message);
    }
} 

defaultFetchData()