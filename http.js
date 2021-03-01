function ajax(method, url, data, contentType, callback) {
  var http = new XMLHttpRequest();
  if (method == "get") {
    if (data) {
      console.err('do not support get with data');
    }
    http.open(method, url);
    http.setRequestHeader("Content-Type", contentType);
    http.send();
  } else {
    http.open(method, url);
    http.setRequestHeader("Content-Type", contentType);
    if (data) {
      http.send(data)
    } else {
      http.send();
    }
  }
  http.onreadystatechange = function() {
    if (http.readyState == 4 && http.status == 200) {
      callback(http.response);
    }
  }
}
