package com.boda.backend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.boda.backend.admin.AdminAuthInterceptor;
import com.boda.backend.partner.PartnerAuthInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AdminAuthInterceptor adminAuthInterceptor;
    private final PartnerAuthInterceptor partnerAuthInterceptor;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    public WebConfig(AdminAuthInterceptor adminAuthInterceptor, PartnerAuthInterceptor partnerAuthInterceptor) {
        this.adminAuthInterceptor = adminAuthInterceptor;
        this.partnerAuthInterceptor = partnerAuthInterceptor;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(parseOrigins())
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(adminAuthInterceptor).addPathPatterns("/api/admin/**");
        registry.addInterceptor(partnerAuthInterceptor).addPathPatterns("/api/partner/**");
    }

    private String[] parseOrigins() {
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toList();
        return origins.toArray(String[]::new);
    }
}
