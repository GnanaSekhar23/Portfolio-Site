package com.gnana.portfolio.service;

import com.gnana.portfolio.dto.ContactRequest;
import com.gnana.portfolio.model.ContactMessage;
import com.gnana.portfolio.repository.ContactMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactMessageRepository contactMessageRepository;
    private final Optional<JavaMailSender> mailSender;

    @Value("${app.contact.notify-email:}")
    private String notifyEmail;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    public ContactService(ContactMessageRepository contactMessageRepository, Optional<JavaMailSender> mailSender) {
        this.contactMessageRepository = contactMessageRepository;
        this.mailSender = mailSender;
    }

    public ContactMessage submit(ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setMessage(request.getMessage());

        ContactMessage saved = contactMessageRepository.save(message);

        if (mailEnabled && mailSender.isPresent() && notifyEmail != null && !notifyEmail.isBlank()) {
            try {
                sendNotification(saved, mailSender.get());
            } catch (Exception e) {
                // Never fail the request just because email notification failed —
                // the message is already safely persisted.
                log.warn("Failed to send contact notification email: {}", e.getMessage());
            }
        }

        return saved;
    }

    private void sendNotification(ContactMessage message, JavaMailSender sender) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(notifyEmail);
        mail.setSubject("Portfolio contact form: " + message.getName());
        mail.setText(
                "New message from your portfolio site:\n\n" +
                "Name: " + message.getName() + "\n" +
                "Email: " + message.getEmail() + "\n\n" +
                "Message:\n" + message.getMessage()
        );
        sender.send(mail);
    }

    public List<ContactMessage> findAll() {
        return contactMessageRepository.findAllByOrderBySubmittedAtDesc();
    }

    public void markRead(Long id, boolean read) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new com.gnana.portfolio.exception.ResourceNotFoundException("Message not found"));
        message.setRead(read);
        contactMessageRepository.save(message);
    }
}
