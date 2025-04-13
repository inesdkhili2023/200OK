// ChatMessage.java
package com.ahch.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
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

    // Using Boolean object instead of primitive to handle null cases
    // Mark column with a different name to avoid SQL reserved keyword
    @Column(name = "is_read")
    private Boolean read = false;

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

    // Helper methods to prevent null pointer exceptions
    public boolean isRead() {
        return Boolean.TRUE.equals(read);
    }

    public void setRead(Boolean read) {
        this.read = read != null ? read : false;
    }

    public enum MessageType {
        TEXT("text"),
        NOTIFICATION("notification"),
        SYSTEM("system");

        private final String value;

        MessageType(String value) {
            this.value = value;
        }

        @JsonValue
        public String getValue() {
            return value;
        }

        @JsonCreator
        public static MessageType fromValue(String value) {
            if (value == null) {
                return null;
            }

            // Try direct match first
            for (MessageType type : values()) {
                if (type.value.equals(value)) {
                    return type;
                }
            }

            // Try case-insensitive match
            for (MessageType type : values()) {
                if (type.name().equalsIgnoreCase(value)) {
                    return type;
                }
            }

            // Default fallback to TEXT
            return TEXT;
        }
    }
}
