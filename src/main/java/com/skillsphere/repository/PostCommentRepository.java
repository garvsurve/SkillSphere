package com.skillsphere.repository;

import com.skillsphere.entity.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    List<PostComment> findByPostIdOrderByCreatedAtAsc(Long postId);

    List<PostComment> findByPostIdAndParentCommentIsNullOrderByCreatedAtAsc(Long postId);

    long countByPostId(Long postId);
}
