package com.gnana.portfolio.controller;

import com.gnana.portfolio.model.ContactMessage;
import com.gnana.portfolio.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/messages")
public class AdminContactController {

    private final ContactService contactService;

    public AdminContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(contactService.findAll());
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        boolean read = body.getOrDefault("read", true);
        contactService.markRead(id, read);
        return ResponseEntity.noContent().build();
    }
}
