package com.ahch.Repo;

import com.ahch.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Find messages between two users (in either direction)
    @Query("SELECT c FROM ChatMessage c WHERE " +
            "(c.senderId = :userId1 AND c.receiverId = :userId2) OR " +
            "(c.senderId = :userId2 AND c.receiverId = :userId1) " +
            "ORDER BY c.timestamp ASC")
    List<ChatMessage> findConversationBetweenUsers(@Param("userId1") Integer userId1,
                                                   @Param("userId2") Integer userId2);

    // Find all conversations for a user
    @Query("SELECT DISTINCT " +
            "CASE WHEN c.senderId = :userId THEN c.receiverId ELSE c.senderId END " +
            "FROM ChatMessage c " +
            "WHERE c.senderId = :userId OR c.receiverId = :userId")
    List<Integer> findAllConversationPartnerIds(@Param("userId") Integer userId);

    // Get unread messages count for a user
    @Query("SELECT COUNT(c) FROM ChatMessage c WHERE c.receiverId = :userId AND c.read = false")
    long countUnreadMessagesForUser(@Param("userId") Integer userId);

    // Find recent messages for a user
    @Query(value = "SELECT c.* FROM chat_messages c " +
            "WHERE (c.sender_id = :userId OR c.receiver_id = :userId) " +
            "ORDER BY c.timestamp DESC LIMIT :limit",
            nativeQuery = true)
    List<ChatMessage> findRecentMessagesForUser(@Param("userId") Integer userId, @Param("limit") int limit);
}