package com.gnana.portfolio.controller;

import com.gnana.portfolio.dto.ApiResponse;
import com.gnana.portfolio.dto.ContactRequest;
import com.gnana.portfolio.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> submitContact(@Valid @RequestBody ContactRequest request) {
        contactService.submit(request);
        return ResponseEntity.ok(new ApiResponse(true, "Message sent — thanks for reaching out. I'll get back to you soon."));
    }
}
