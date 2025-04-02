// ChatMessage.java
package com.ahch.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer senderId;
    private String senderName;
    private Integer receiverId;
    private String content;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private boolean read;

    @Enumerated(EnumType.STRING)
    private MessageType type;

    // Constructor for quick message creation
    public ChatMessage(Integer senderId, String senderName, Integer receiverId, String content, MessageType type) {
        this.senderId = senderId;
        this.senderName = senderName;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = LocalDateTime.now();
        this.read = false;
        this.type = type;
    }

    public enum MessageType {
        TEXT, NOTIFICATION, SYSTEM
    }
}
