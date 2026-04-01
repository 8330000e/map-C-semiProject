import React from "react";
import { dummyData } from "../mock/dummyData";

const PostList = ({
  limit,
  expandedPostId = null,
  onExpandedIdChange,
}) => {
  const posts = Number.isInteger(limit) && limit > 0 ? dummyData.slice(0, limit) : dummyData;

  const handleToggle = (postId) => {
    if (!onExpandedIdChange) return;
    onExpandedIdChange(expandedPostId === postId ? null : postId);
  };

  return (
    <ul>
      {posts.map((post) => {
        const isExpanded = expandedPostId === post.id;

        return (
          <li
            key={post.id}
            onClick={() => handleToggle(post.id)}
            style={{ cursor: onExpandedIdChange ? "pointer" : "default" }}
          >
            <p>{post.title}</p>
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
