package kr.co.iei.utils;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // 에디터 이미지
        registry.addResourceHandler("/board/editor/**")
                .addResourceLocations("file:///C:/Temp/upload/board/editor/");

        
    }
}