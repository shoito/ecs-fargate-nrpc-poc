import { check, sleep } from "k6";
import http from "k6/http";

const BASE_PATH = "http://localhost:9080";

export let options = {
  thresholds: {
    http_req_duration: ["p(95)<500"]
  }
};

export default function() {
  check(http.get(`${BASE_PATH}/xyz/${Math.floor(Math.random() * 10)}`), {
    "status was 200": res => res.status === 200,
    "content type was html": res =>
      res.headers["Content-Type"] === "text/html; charset=utf-8",
    "transaction time OK": res => res.timings.duration < 1000
  });
  sleep(1);
}
