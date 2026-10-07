// CloudFront viewer-request function (cloudfront-js-2.0) for the static site on S3.
// Terraform inlines this file, filling in the redirect map below from terraform/redirects.json.
//
// One URL per page: the trailing-slash path is the canonical one, so the other
// spellings answer with a single 301 instead of serving the same page again.
// Then the page is looked up on S3 as .../index.html (or index.md for agents).

// Old path to new path, both lowercase with a trailing slash.
var REDIRECTS = __REDIRECTS__;

// Markdown wins when the client lists text/markdown at least as high as text/html,
// so browsers (text/html, */*) keep HTML and agents asking for markdown get it.
function prefersMarkdown(accept) {
  var markdown = 0;
  var html = 0;
  var ranges = accept.toLowerCase().split(",");
  for (var i = 0; i < ranges.length; i++) {
    var params = ranges[i].split(";");
    var type = params[0].trim();
    var q = 1;
    for (var j = 1; j < params.length; j++) {
      var param = params[j].trim();
      if (param.indexOf("q=") === 0) q = parseFloat(param.slice(2));
    }
    if (type === "text/markdown") markdown = q;
    else if (type === "text/html") html = q;
  }
  return markdown > 0 && markdown >= html;
}

function queryString(request) {
  var parts = [];
  var query = request.querystring || {};
  for (var key in query) {
    var entry = query[key];
    var values = entry.multiValue
      ? entry.multiValue.map(function (item) {
          return item.value;
        })
      : [entry.value];
    for (var i = 0; i < values.length; i++) {
      parts.push(values[i] === "" ? key : key + "=" + values[i]);
    }
  }
  return parts.length ? "?" + parts.join("&") : "";
}

function redirect(path, request) {
  return {
    statusCode: 301,
    statusDescription: "Moved Permanently",
    headers: {
      location: { value: path + queryString(request) },
      "cache-control": { value: "public, max-age=3600" },
    },
  };
}

// The build writes an index.md next to every index.html. Rewriting the URI
// (not varying on Accept) keeps the two representations apart in the cache.
// CloudFront calls this by name.
// eslint-disable-next-line no-unused-vars
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // /pricing/index.html is /pricing/
  if (uri.endsWith("/index.html")) {
    return redirect(uri.slice(0, -"index.html".length).toLowerCase(), request);
  }

  // Anything with a dot is a file (assets, llms.txt, .well-known, index.md): leave it alone.
  if (uri.includes(".")) return request;

  // A page: lowercase, trailing slash, and one hop through the redirect map.
  var path = uri.toLowerCase();
  if (!path.endsWith("/")) path += "/";
  var target = REDIRECTS.hasOwnProperty(path) ? REDIRECTS[path] : path;
  if (target !== uri) return redirect(target, request);

  var accept = request.headers["accept"];
  request.uri = uri + "index" + (accept && prefersMarkdown(accept.value) ? ".md" : ".html");
  return request;
}
