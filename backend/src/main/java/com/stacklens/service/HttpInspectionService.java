package com.stacklens.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Service
public class HttpInspectionService {

    private final HttpClient httpClient;

    public static class InspectionResult {
        public String url;
        public int statusCode;
        public Map<String, String> headers = new LinkedHashMap<>();
        public List<String> cookies = new ArrayList<>();
        public List<String> scriptUrls = new ArrayList<>();
        public List<String> stylesheetUrls = new ArrayList<>();
        public String rawHtml = "";
        public String pageTitle = "";
        public List<String> metaTags = new ArrayList<>();
    }

    public HttpInspectionService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(6))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    public InspectionResult inspect(URI uri) throws Exception {
        InspectionResult result = new InspectionResult();
        result.url = uri.toString();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(uri)
                .timeout(Duration.ofSeconds(10))
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 StackLens/2.0")
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
                .header("Accept-Language", "en-US,en;q=0.9")
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        result.statusCode = response.statusCode();

        // Extract headers
        response.headers().map().forEach((k, v) -> {
            if (!v.isEmpty()) {
                result.headers.put(k.toLowerCase(), String.join(", ", v));
            }
        });

        // Extract cookies
        List<String> setCookies = response.headers().allValues("set-cookie");
        result.cookies.addAll(setCookies);

        result.rawHtml = response.body();

        // Parse HTML DOM via Jsoup
        if (result.rawHtml != null && !result.rawHtml.isEmpty()) {
            Document doc = Jsoup.parse(result.rawHtml, uri.toString());
            result.pageTitle = doc.title();

            Elements scripts = doc.select("script[src]");
            for (Element script : scripts) {
                String src = script.attr("abs:src");
                if (src != null && !src.isEmpty()) {
                    result.scriptUrls.add(src);
                }
            }

            Elements links = doc.select("link[rel=stylesheet]");
            for (Element link : links) {
                String href = link.attr("abs:href");
                if (href != null && !href.isEmpty()) {
                    result.stylesheetUrls.add(href);
                }
            }

            Elements metas = doc.select("meta");
            for (Element meta : metas) {
                String name = meta.attr("name");
                String content = meta.attr("content");
                if (!name.isEmpty() && !content.isEmpty()) {
                    result.metaTags.add(name + "=" + content);
                }
            }
        }

        return result;
    }
}
