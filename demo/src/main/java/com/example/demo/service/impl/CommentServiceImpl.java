package com.example.demo.service.impl;

import com.example.demo.dto.request.CommentCreateRequest;
import com.example.demo.dto.request.CommentUpdateRequest;
import com.example.demo.dto.response.CommentResponse;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.article.Article;
import com.example.demo.entity.article.ArticleStatus;
import com.example.demo.entity.comment.Comment;
import com.example.demo.entity.user.User;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ForbiddenException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ArticleRepository;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.SecurityUtils;
import com.example.demo.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    @Override
    public PageResponse<CommentResponse> getArticleComments(Long articleId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(size, 100));
        Page<Comment> commentPage = commentRepository.findByArticleIdAndParentIsNullOrderByCreatedAtDesc(articleId, pageable);
        
        List<Long> parentIds = commentPage.getContent().stream().map(Comment::getId).collect(Collectors.toList());
        Map<Long, List<Comment>> repliesMap = Map.of();
        
        if (!parentIds.isEmpty()) {
            List<Comment> allReplies = commentRepository.findByParentIdInOrderByCreatedAtAsc(parentIds);
            repliesMap = allReplies.stream().collect(Collectors.groupingBy(c -> c.getParent().getId()));
        }
        
        final Map<Long, List<Comment>> finalRepliesMap = repliesMap;
        
        List<CommentResponse> content = commentPage.getContent().stream()
                .map(c -> {
                    CommentResponse res = mapBasic(c);
                    List<Comment> reps = finalRepliesMap.getOrDefault(c.getId(), new ArrayList<>());
                    res.setReplies(reps.stream().map(this::mapBasic).collect(Collectors.toList()));
                    return res;
                })
                .collect(Collectors.toList());
                
        return new PageResponse<>(content, commentPage.getNumber(), commentPage.getSize(), 
                commentPage.getTotalElements(), commentPage.getTotalPages());
    }

    @Override
    @Transactional
    public CommentResponse addComment(Long articleId, CommentCreateRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow();
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found"));

        if (article.getStatus() != ArticleStatus.PUBLISHED) {
            throw new BadRequestException("Cannot comment on unpublished article");
        }

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setArticle(article);
        comment.setUser(user);

        if (request.getParentId() != null) {
            Comment parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
            comment.setParent(parent);
        }

        Comment saved = commentRepository.save(comment);
        return mapBasic(saved);
    }

    @Override
    @Transactional
    public CommentResponse updateComment(Long commentId, CommentUpdateRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
                
        Long userId = SecurityUtils.getCurrentUserId();
        if (!comment.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Not allowed to edit this comment");
        }
        
        comment.setContent(request.getContent());
        return mapBasic(commentRepository.save(comment));
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow();
        
        if (!comment.getUser().getId().equals(userId) && !user.getRole().name().equals("ADMIN")) {
            throw new ForbiddenException("Not allowed to delete this comment");
        }
        
        commentRepository.delete(comment);
    }
    
    private CommentResponse mapBasic(Comment comment) {
        CommentResponse res = new CommentResponse();
        res.setId(comment.getId());
        res.setUserName(comment.getUser().getName());
        res.setContent(comment.getContent());
        res.setStatus(comment.getStatus().name());
        res.setCreatedAt(comment.getCreatedAt());
        return res;
    }
}
