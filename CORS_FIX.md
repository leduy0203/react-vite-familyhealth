# 🔴 FIX LỖI CORS - Spring Boot + React

## ❌ Lỗi hiện tại:
```
Access to XMLHttpRequest at 'http://localhost:8080/familyhealth/api/v1/doctors' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## 🔍 NGUYÊN NHÂN:

1. **Spring Security chặn OPTIONS preflight request** trước khi CORS config được áp dụng
2. Frontend gửi `Authorization: Bearer token` → Browser gửi OPTIONS request trước
3. Backend không trả về header CORS đúng cho OPTIONS request

---

## ✅ GIẢI PHÁP 1: Config CORS trong Spring Security (RECOMMENDED)

### File: `SecurityConfig.java`

```java
package com.familyhealth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // ✅ Enable CORS với config source
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Disable CSRF cho API
            .csrf(csrf -> csrf.disable())
            
            // Configure authorization
            .authorizeHttpRequests(auth -> auth
                // ⭐ QUAN TRỌNG: Allow tất cả OPTIONS requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Public endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/login").permitAll()
                .requestMatchers("/api/v1/register").permitAll()
                
                // Doctors endpoints - GET public, POST cần ADMIN
                .requestMatchers(HttpMethod.GET, "/api/v1/doctors/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/doctors/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/doctors/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/doctors/**").hasRole("ADMIN")
                
                // All other requests cần authentication
                .anyRequest().authenticated()
            )
            
            // Nếu dùng JWT Filter
            // .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            
            // Session management (stateless cho API)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
            
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // ⭐ Allow React dev server origin
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:3000"  // Nếu dùng port khác
        ));
        
        // ⭐ Allow tất cả HTTP methods (bao gồm OPTIONS)
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"
        ));
        
        // ⭐ Allow tất cả headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // ⭐ Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // ⭐ Cache preflight response trong 1 giờ (giảm số request OPTIONS)
        configuration.setMaxAge(3600L);
        
        // ⭐ Expose headers để frontend đọc được
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type",
            "X-Total-Count"
        ));
        
        // Apply cho tất cả endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
```

### ❌ **XÓA hoặc COMMENT OUT WebMvcConfigurer CORS:**

```java
// ❌ XÓA HOẶC COMMENT CODE NÀY - Nó bị Spring Security override
/*
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
        }
    };
}
*/
```

---

## ✅ GIẢI PHÁP 2: Nếu KHÔNG dùng Spring Security

### File: `CorsConfig.java`

```java
package com.familyhealth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // ← Thêm OPTIONS
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600); // Cache preflight 1 giờ
            }
        };
    }
}
```

---

## ✅ GIẢI PHÁP 3: Thêm CORS Filter (Fallback)

Nếu 2 cách trên không work, thêm Filter:

```java
package com.familyhealth.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Max-Age", "3600");

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(req, res);
        }
    }
}
```

---

## 🧪 CÁCH TEST:

### 1. **Check CORS với cURL:**

```bash
# Test OPTIONS preflight request
curl -X OPTIONS http://localhost:8080/familyhealth/api/v1/doctors \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v

# Phải thấy response headers:
# Access-Control-Allow-Origin: http://localhost:5173
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
# Access-Control-Allow-Credentials: true
```

### 2. **Test GET request:**

```bash
curl http://localhost:8080/familyhealth/api/v1/doctors \
  -H "Origin: http://localhost:5173" \
  -v
```

### 3. **Check trong Browser Console:**

Frontend đã có debug logs:
```
🔵 Request: GET /doctors
🔑 Token: Present
✅ Response: 200 /doctors
```

Nếu lỗi CORS:
```
❌ Error: Network Error
   CORS: YES - Check backend!
```

---

## 📋 CHECKLIST:

- [ ] Add CORS config trong `SecurityConfig.java`
- [ ] Allow OPTIONS requests: `.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()`
- [ ] Set `allowCredentials(true)`
- [ ] Set `maxAge(3600L)` để cache preflight
- [ ] Xóa/comment WebMvcConfigurer CORS config
- [ ] Restart Spring Boot server
- [ ] Clear browser cache (Ctrl+Shift+R)
- [ ] Test với cURL
- [ ] Check browser Network tab (OPTIONS request trước GET request)

---

## 🚨 LƯU Ý:

1. **Spring Security PHẢI có CORS config riêng** - WebMvcConfigurer không đủ
2. **OPTIONS request phải được permitAll()** - Không cần authentication
3. **allowCredentials(true)** chỉ work với origin cụ thể - không dùng "*"
4. **Restart backend** sau khi đổi config
5. **Hard refresh browser** (Ctrl+Shift+R) để clear cache

---

## 📞 NẾU VẪN LỖI:

1. Check Spring Boot console log khi OPTIONS request đến
2. Check Network tab trong browser: OPTIONS request có status 200?
3. Check response headers của OPTIONS request có đúng không?
4. Thử tắt JWT Filter tạm thời để test
5. Thử dùng Postman test endpoint trước (không có CORS)

---

**Last Updated:** 2025-11-18
