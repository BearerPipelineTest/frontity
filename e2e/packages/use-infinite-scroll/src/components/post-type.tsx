import React from "react";
import { css, connect, useConnect } from "frontity";
import { usePostTypeInfiniteScroll } from "@frontity/hooks";
import { Packages } from "../../types";
import { isPostType } from "@frontity/source";

/**
 * Component to render post types.
 *
 * @returns A React node.
 */
const PostType: React.FC = () => {
  const { state } = useConnect<Packages>();
  const current = state.source.get(state.router.link);

  const {
    posts,
    isFetching,
    isError,
    isLimit,
    fetchNext,
  } = usePostTypeInfiniteScroll({
    active: state.theme.isInfiniteScrollEnabled,
    limit: state.theme.infiniteScrollLimit,
    archive: state.theme.infiniteScrollArchive,
    fetchInViewOptions: {
      rootMargin: "400px 0px",
      triggerOnce: true,
    },
    routeInViewOptions: {
      rootMargin: "-80% 0% -19.9999% 0%",
    },
  });

  if (!current.isReady) return null;

  const div = css`
    height: 200vh;
  `;

  const fetchDiv = css`
    height: 100vh;
  `;

  return (
    <div data-test="post-type">
      {posts.map(({ Wrapper, key, link, isLast }) => {
        const data = state.source.get(link);
        return isPostType(data) ? (
          <Wrapper key={key}>
            <div css={div} data-test={`post-${data.id}`}>
              Post {data.id}
            </div>
            {isLast && <div data-test="last">You reached the end!</div>}
          </Wrapper>
        ) : null;
      })}
      {isFetching && <div data-test="fetching">Fetching</div>}
      {(isError || isLimit) && (
        <div
          data-test={(isError && "error") || (isLimit && "limit")}
          css={fetchDiv}
        >
          <button data-test="fetch" onClick={fetchNext}>
            Fetch Next
          </button>
        </div>
      )}
    </div>
  );
};

export default connect(PostType);
