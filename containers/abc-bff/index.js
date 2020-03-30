const { randomStr, sleep } = require("./utils");
const express = require("express");
const app = express();
app.disable("x-powered-by");

app.get("/abc/health", (req, res) => {
  res.send("bff is healthy");
});

app.get("/abc/:id", async (req, res) => {
  await sleep(Math.random() * 300);
  res.send(
    `<div>id: ${req.params.id}</div>
<div>time: ${new Date().getTime()}</div>
<div>${randomStr(20000)}</div>`
  );
});

app.listen(3000);
