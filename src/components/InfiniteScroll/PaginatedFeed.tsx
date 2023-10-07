// import React from 'react'

import InfiniteScroll from "react-infinite-scroll-component";

type Props = {
  fetchData: () => void;
  hasMore: boolean;
  data: JSX.Element[];
  // scrollableTarget?: string;
};

export default function PaginatedFeed({
  data,
  fetchData,
  hasMore,
}: // scrollableTarget,
Props) {
  return (
    <InfiniteScroll
      dataLength={data.length} //This is important field to render the next data
      next={fetchData}
      // height={scrollableTarget}
      // scrollableTarget={scrollableTarget}
      hasMore={hasMore}
      // todo ---- add a propoer loader to aler users when we are fetching more posts
      loader={<h4>Loading...</h4>}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
      //   endMessage={
      //     <p style={{ textAlign: "center" }}>
      //       <b>Yay! You have seen it all</b>
      //     </p>
      //   }
      // below props only if you need pull down functionality
      //   refreshFunction={this.refresh}
      //   pullDownToRefresh
      //   pullDownToRefreshThreshold={50}
      //   pullDownToRefreshContent={
      //     <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
      //   }
      //   releaseToRefreshContent={
      //     <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
      //   }
    >
      {data}
    </InfiniteScroll>
  );
}
