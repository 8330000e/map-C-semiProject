// 게시글 목록을 출력하는 재사용 컴포넌트입니다.
// limit, 펼침 상태(expandedPostId)를 받아 목록 UI를 렌더링합니다.
import React from "react";
import { dummyData } from "../mock/dummyData";

const PostList = ({ limit, expandedPostId = null, onExpandedIdChange }) => {
  const posts =
    Number.isInteger(limit) && limit > 0
      ? dummyData.slice(0, limit)
      : dummyData;

  const handleToggle = (postId) => {
    if (!onExpandedIdChange) return;
    onExpandedIdChange(expandedPostId === postId ? null : postId);
  };

  return (
    // 게시글 목록 전체 컨테이너
    <ul>
      {posts.map((post) => {
        const isExpanded = expandedPostId === post.id;

        return (
          // 개별 게시글 항목
          <li
            key={post.id}
            onClick={() => handleToggle(post.id)}
            style={{ cursor: onExpandedIdChange ? "pointer" : "default" }}
          >
            {/* 제목 섹션 */}
            <p>{post.title}</p>

            {/* 확장 시 상세 정보 노출 섹션 */}
            {isExpanded && (
              <div>
                <small>
                  작성자: {post.author} · 작성일: {post.createdAt}
                </small>
                <p>댓글 {post.comments?.length || 0}개</p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default PostList;
