package com.planetrush.planetrush.core.config.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@EnableWebMvc
@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		// registry
		// 	.addMapping("/**")
		// 	.allowedOrigins("*")
		// 	.allowedMethods(HttpMethod.GET.name(), HttpMethod.POST.name(), HttpMethod.PUT.name(),
		// 		HttpMethod.DELETE.name(), HttpMethod.HEAD.name(), HttpMethod.OPTIONS.name(),
		// 		HttpMethod.PATCH.name())
		// 	.maxAge(1800);
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		// registry.addInterceptor(jwtInterceptor)
		// 	.addPathPatterns("/admin/**")
		// 	.excludePathPatterns("/members/oauth/**", "/swagger-ui.html", "/api/**");
	}
}
