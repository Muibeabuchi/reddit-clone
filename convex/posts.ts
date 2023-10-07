import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

const createPostArgs = {
  // get the posters profile id and name on the server
  postBody: v.string(),
  postTitle: v.string(),
  postImageId: v.string(),
  // we pass in the community_id and community_name
  //   communityId: v.id("community"),
  communityName: v.string(),
  numberOfVotes: v.number(),
};

export const createPost = mutation({
  args: createPostArgs,
  handler: async (ctx, args) => {
    //?get the users auth identity token, use it to query the profile table to get the id and user name

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    // get users tokenidentifier,which is same as profileId
    const { tokenIdentifier } = identity;

    const profileId = await ctx.db
      .query("profile")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .unique();

    if (!profileId)
      throw new Error(
        "an error occured looking for profileId in profile table"
      );

    //  ? get  the community id by querying the table with the unique community name

    const communityRef = await ctx.db
      .query("community")
      .withIndex("by_communityName", function (q) {
        return q.eq("communityName", args.communityName);
      })
      .unique();

    if (!communityRef) throw new Error("community could not be found");

    //? create the object that is to be passed to the mutation

    // save the post image if it exists
    const postId = await ctx.db.insert("posts", {
      authorId: profileId._id,
      authorName: profileId.profileName,
      communityId: communityRef._id,
      communityName: args.communityName,
      communityImageUrl: communityRef.communityImage,
      numberOfComments: 0,
      numberOfVotes: 0,
      postBody: args.postBody,
      postImageId: args.postImageId,
      postTitle: args.postTitle,
    });
    return postId;
  },
});

export const getCommunityPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    communityName: v.string(),
  },
  handler: async (ctx, args) => {
    // grab the community id using the name
    const communityRef = await ctx.db
      .query("community")
      .withIndex("by_communityName", (q) =>
        q.eq("communityName", args.communityName)
      )
      .unique();

    if (!communityRef) throw new Error("the community dos not exist");

    const communityPosts = await ctx.db
      .query("posts")
      .withIndex("by_communityId", (q) => q.eq("communityId", communityRef._id))
      .order("desc")
      .paginate(args.paginationOpts);

    // get the imageurl of each post
    const communityPostWithImages = await Promise.all(
      communityPosts.page.map(async (post) => {
        const postImage = post.postImageId
          ? await ctx.storage.getUrl(post.postImageId)
          : "";
        return { ...post, postImageId: postImage ? postImage : "" };
      })
    );

    const communityPostWithImagesAndVotes = await Promise.all(
      communityPostWithImages.map(async (post) => {
        const postVotes = await ctx.db
          .query("votes")
          .withIndex("by_PostIndex", (q) => q.eq("postId", post._id))
          .collect();

        return {
          ...post,
          postVotes,
        };
      })
    );

    // const communityPostWithImagesAndVotesAndComments = Promise.all(
    //   (await communityPostWithImagesAndVotes).map(async (post) => {
    //     const postComments = await ctx.db
    //       .query("comments")
    //       .withIndex("by_postId", (q) => q.eq("postId", post._id))
    //       .collect();

    //       return {
    //         ...post,
    //         numberOfComments
    //       }

    //   })
    // );

    // todo ===== fetch vote data for posts
    // const communityPostsWithVotes = Promise.all(
    //   communityPosts.map(async (post) => {
    //     const postVoters = await ctx.db
    //       .query("votes")
    //       .withIndex("by_PostIndex", (q) => q.eq("postId", post._id))
    //       .collect();
    //       return {...post,votes:postVoters}
    //   })
    // );

    return {
      ...communityPosts,
      page: communityPostWithImagesAndVotes,
    };
  },
});

export const deleteCommunityPost = mutation({
  args: {
    postId: v.id("posts"), //the user has to pass the his/her userid to confirm that the post is theirs
  },
  handler: async (ctx, args) => {
    // check if the user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called deletePost without authentication present");
    }
    // get users tokenidentifier,which is same as profileId
    const { tokenIdentifier } = identity;

    const profileId = await ctx.db
      .query("profile")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))

      .unique();

    if (!profileId) throw new Error("the user has no profile in database");
    // use postId to query post table and get the ostref, extract post author to verify ownership of post
    const postRef = await ctx.db.get(args.postId);
    if (!postRef) throw new Error("the post does not exist");

    const isAllowedToDelete = postRef?.authorId === profileId?._id;

    if (!isAllowedToDelete)
      throw new Error("user is not permitted to delete this post");

    // find all the votes on a post and delete them
    const postsVotes = await ctx.db
      .query("votes")
      .withIndex("by_PostIndex", (q) => q.eq("postId", args.postId))
      .collect();

    // map through all of them and delete them
    Promise.all(
      postsVotes.map(async (vote) => {
        await ctx.db.delete(vote._id);
      })
    );

    // todo ------ we also delete all comments on a post

    // if user is author of post, delete the post
    await ctx.db.delete(args.postId);
  },
});

export const getSinglePost = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("the post does not exist!");

    // get image of the post if it exists

    const postImage = post.postImageId
      ? await ctx.storage.getUrl(post.postImageId)
      : "";

    // const singlePostWithVotes = post._id

    const postVotes = await ctx.db
      .query("votes")
      .withIndex("by_PostIndex", (q) => q.eq("postId", post?._id))
      .collect();

    const singlePostWithVotes = {
      ...post,
      postImageId: postImage || "",
      postVotes,
    };

    return singlePostWithVotes;
  },
});

export const getHomepageFeedUnauthenticated = query({
  args: {
    paginationOpts: paginationOptsValidator,

    userAuthToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // check if ghe passed argument belongs to any user in the profile table
    // fetch data for all latest posts
    const cutoff = Date.now() - 2 * 60 * 1000;
    const latestPosts = await ctx.db
      .query("posts")
      .withIndex("by_creation_time", (q) => q.lt("_creationTime", cutoff))
      // .order("desc")
      .paginate(args.paginationOpts);

    // get the imageurl of each post
    const communityPostWithImages = await Promise.all(
      latestPosts.page.map(async (post) => {
        const postImage = post.postImageId
          ? await ctx.storage.getUrl(post.postImageId)
          : "";
        return { ...post, postImageId: postImage ? postImage : "" };
      })
    );

    const communityPostWithImagesAndVotes = await Promise.all(
      communityPostWithImages.map(async (post) => {
        const postVotes = await ctx.db
          .query("votes")
          .withIndex("by_PostIndex", (q) => q.eq("postId", post._id))
          .collect();

        return {
          ...post,
          postVotes,
        };
      })
    );

    // fetch data for all trending posts---posts with high number of votes

    return { ...latestPosts, page: communityPostWithImagesAndVotes };
  },
});
