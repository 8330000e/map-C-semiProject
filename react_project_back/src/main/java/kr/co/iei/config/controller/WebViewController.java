package kr.co.iei.config.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// @Controller
public class WebViewController {

    @GetMapping({
        "/",
        "/{x:[\\w\\-]+}",
        "/{x:^(?!api$).*$}/**/{y:[\\w\\-]+}"
    })
    public String redirect() {
        return "forward:/index.html";
    }
}