package com.skillsphere.repository;

import com.skillsphere.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p JOIN FETCH p.author ORDER BY p.createdAt DESC")
    List<Post> findAllWithAuthorOrderByCreatedAtDesc();

    List<Post> findByAuthorIdOrderByCreatedAtDesc(Long authorId);

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
