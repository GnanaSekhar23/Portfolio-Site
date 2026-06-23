package com.gnana.portfolio.repository;

import com.gnana.portfolio.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findAllByOrderBySubmittedAtDesc();
}
