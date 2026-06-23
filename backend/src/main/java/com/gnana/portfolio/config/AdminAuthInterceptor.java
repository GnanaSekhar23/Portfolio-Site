package com.gnana.portfolio.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    @Value("${app.admin.token}")
    private String adminToken;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Browsers send an OPTIONS preflight before the real request for any
        // cross-origin call with custom headers (X-Admin-Token qualifies).
        // The preflight never carries that header, so it must be allowed
        // through here unconditionally — Spring's CORS config (WebConfig)
        // handles deciding whether the preflight itself is allowed.
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String header = request.getHeader("X-Admin-Token");
        if (header == null || !header.equals(adminToken)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false,\"message\":\"Unauthorized: invalid or missing admin token\"}");
            return false;
        }
        return true;
    }
}
