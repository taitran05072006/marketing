import type { CommentStatus } from './common.types';

// Matches backend CommentResponse DTO (recursive for nested replies)
export interface CommentResponse {
  id: number;
  userName: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
  replies: CommentResponse[];
}

// Matches backend CommentCreateRequest DTO
export interface CommentCreateRequest {
  content: string;
  parentId?: number;
}

// Matches backend CommentUpdateRequest DTO
export interface CommentUpdateRequest {
  content: string;
}
